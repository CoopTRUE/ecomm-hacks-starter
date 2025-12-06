import { gemini3ProModel, genAI } from './gemini'
import {
  type CountryCode,
  LocalizationStatus,
  prisma,
  type StoreInformation,
  StoreStatus,
} from './prisma'

export interface LocalizationData {
  translated_name: string
  translated_description: string
  regulatory_requirements: string[]
  required_marks: string[]
  warnings: string[]
  placement_suggestions: string
}

// Helper to convert buffer to base64 for Gemini
function bufferToInlineData(buffer: Uint8Array, mimeType = 'image/jpeg') {
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType,
    },
  }
}

export async function analyzeStore({ id, images }: StoreInformation): Promise<string> {
  // const store = await prisma.storeInformation.findUnique({
  //   where: {
  //     id: storeId,
  //     status: {
  //       in: [StoreStatus.PENDING, StoreStatus.FAILED],
  //     },
  //   },
  // })

  if (!images || images.length === 0) {
    throw new Error('Store information not found or no images')
  }

  await prisma.storeInformation.update({
    where: { id },
    data: { status: StoreStatus.ANALYZING },
  })

  await new Promise((resolve) => setTimeout(resolve, 10000))

  const prompt = `
      Analyze this product image and extract the following information in JSON format:
      1. product_name: The name of the product.
      2. description: A brief description of the product.
      3. text_content: All visible text on the packaging (preserve hierarchy).
      4. category: Product category (food, electronics, cosmetics, etc.).
      5. market: Current market/language inferred from the packaging.
      6. compliance_marks: Any existing compliance marks visible (e.g., CE, FCC).
      7. ingredients: Ingredients or materials list if present.
    `

  try {
    // Use the first image for analysis
    const imagePart = bufferToInlineData(images[0])

    const { response } = await gemini3ProModel.generateContent([prompt, imagePart])
    const text = response.text()
    await prisma.storeInformation.update({
      where: { id },
      data: { analysis: text, status: StoreStatus.ANALYZED },
    })
    console.log('Analysis:', text)
    return text
  } catch (error) {
    console.error('Error analyzing product:', error)
    await prisma.storeInformation.update({
      where: { id },
      data: { status: StoreStatus.ANALYSIS_FAILED },
    })
    throw error
  }
}

export async function localizeStore(store: StoreInformation, regions: CountryCode[] = []) {
  // Update status to LOCALIZING
  await prisma.storeInformation.update({
    where: { id: store.id },
    data: { status: StoreStatus.LOCALIZING },
  })

  try {
    const results = await Promise.allSettled(
      regions.map((region) => localizeProduct(store.id, region))
    )

    // Check if all failed
    const allFailed = results.every((r) => r.status === 'rejected')
    if (allFailed && regions.length > 0) {
      await prisma.storeInformation.update({
        where: { id: store.id },
        data: { status: StoreStatus.LOCALIZATION_FAILED },
      })
    } else {
      await prisma.storeInformation.update({
        where: { id: store.id },
        data: { status: StoreStatus.LOCALIZED },
      })
    }
  } catch (e) {
    console.error('Error in localizeStore:', e)
    await prisma.storeInformation.update({
      where: { id: store.id },
      data: { status: StoreStatus.LOCALIZATION_FAILED },
    })
  }
}

export async function localizeProduct(storeId: string, region: CountryCode) {
  try {
    // 1. Create or update LocalizedVariant to PENDING
    // Check if exists first to avoid duplicates if retrying
    let variant = await prisma.localizedVariant.findFirst({
      where: { storeInformationId: storeId, region },
    })

    if (!variant) {
      variant = await prisma.localizedVariant.create({
        data: {
          storeInformationId: storeId,
          region,
          status: LocalizationStatus.GENERATING,
        },
      })
    } else {
      await prisma.localizedVariant.update({
        where: { id: variant.id },
        data: { status: LocalizationStatus.GENERATING },
      })
    }

    const store = await prisma.storeInformation.findUnique({
      where: { id: storeId },
    })

    if (!store) throw new Error('Store not found')
    if (!store.analysis) throw new Error('Store analysis not found')

    // 2. Generate Localization Text
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: { responseMimeType: 'application/json' },
    })

    const prompt = `
      You are an expert in international product compliance and localization.

      Original product analysis: ${store.analysis}
      Target region: ${region}

      Generate localized content including:
      1. translated_name: Translated product name (culturally appropriate).
      2. translated_description: Translated description.
      3. regulatory_requirements: List of required regulatory text/compliance for ${region}.
      4. required_marks: List of required symbols/marks (e.g., CE, UKCA, Recycling).
      5. warnings: Any mandatory warnings.
      6. placement_suggestions: Suggestions on where to place these elements.

      Consider cultural nuances and legal requirements.
      Output as structured JSON.
    `

    // We might pass the image again for context if needed, but the analysis data should suffice for text.
    // Passing image anyway for better context.
    const imagePart = bufferToInlineData(store.images[0])

    const result = await model.generateContent([prompt, imagePart])
    const localizationData = JSON.parse(result.response.text()) as LocalizationData

    await prisma.localizedVariant.update({
      where: { id: variant.id },
      data: {
        status: LocalizationStatus.COMPLETED,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        localizedText: localizationData as any,
      },
    })

    // 3. Generate Localized Image
    // NOTE: Using a placeholder for "Nano Banana Pro" image generation as per plan.
    // In a real scenario, we would call the image generation API here.

    const generatedImageBuffer = await generateLocalizedImage(
      store.images[0],
      localizationData,
      region
    )

    // 4. Save Results
    await prisma.localizedVariant.update({
      where: { id: variant.id },
      data: {
        status: LocalizationStatus.COMPLETED,
        generatedImage: new Uint8Array(generatedImageBuffer),
      },
    })

    return localizationData
  } catch (error) {
    console.error(`Error localizing for ${region}:`, error)
    // Find the variant again to ensure we have the ID if it was created
    const variant = await prisma.localizedVariant.findFirst({
      where: { storeInformationId: storeId, region },
    })
    if (variant) {
      await prisma.localizedVariant.update({
        where: { id: variant.id },
        data: { status: LocalizationStatus.FAILED },
      })
    }
    throw error
  }
}

// Mock/Placeholder for Image Generation
export async function generateLocalizedImage(
  originalImage: Uint8Array,
  localizationData: LocalizationData,
  region: CountryCode
): Promise<Buffer> {
  // In a real implementation, this would:
  // 1. Call an Image Gen API (e.g. Imagen, DALL-E, Stability)
  // 2. Pass the original image + prompt based on localizationData
  // 3. Return the generated image buffer.

  // For now, we'll return the original image modified slightly or just the original
  // to simulate a result.
  // Note: Returning original image for MVP flow to work without credits/API.

  console.log(`Generating image for ${region.toUpperCase()} with data:`, localizationData)

  // Simulating processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return Buffer.from(originalImage)
}
