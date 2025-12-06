import { type CountryConversion, InspectionStatus, prisma } from './prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Helper to convert buffer to base64 for Gemini
function bufferToInlineData(buffer: Uint8Array, mimeType = 'image/jpeg') {
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType,
    },
  }
}

interface AnalysisData {
  product_name?: string
  [key: string]: any
}

interface LocalizationData {
  translated_name?: string
  [key: string]: any
}

export async function analyzeProduct(inspectionId: string) {
  try {
    const inspection = await prisma.productInspection.findUnique({
      where: { id: inspectionId },
    })

    if (!inspection || !inspection.images || inspection.images.length === 0) {
      throw new Error('Inspection not found or no images')
    }

    await prisma.productInspection.update({
      where: { id: inspectionId },
      data: { status: InspectionStatus.ANALYZING },
    })

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: { responseMimeType: 'application/json' },
    })

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

    // Use the first image for analysis
    const imagePart = bufferToInlineData(inspection.images[0])

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    let analysisData: AnalysisData
    try {
      analysisData = JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse Gemini response:', e)
      // Fallback or partial parse if needed
      analysisData = { raw: text }
    }

    await prisma.productInspection.update({
      where: { id: inspectionId },
      data: {
        status: InspectionStatus.ANALYZED,
        name: analysisData.product_name || 'Unknown Product',
        originalData: analysisData,
      },
    })

    return analysisData
  } catch (error) {
    console.error('Error analyzing product:', error)
    await prisma.productInspection.update({
      where: { id: inspectionId },
      data: { status: InspectionStatus.FAILED },
    })
    throw error
  }
}

export async function localizeProduct(inspectionId: string, region: CountryConversion) {
  try {
    // 1. Create or update LocalizedVariant to PENDING
    // Check if exists first to avoid duplicates if retrying
    let variant = await prisma.localizedVariant.findFirst({
      where: { inspectionId, region },
    })

    if (!variant) {
      variant = await prisma.localizedVariant.create({
        data: {
          inspectionId,
          region,
          status: InspectionStatus.PENDING,
        },
      })
    } else {
      await prisma.localizedVariant.update({
        where: { id: variant.id },
        data: { status: InspectionStatus.PENDING },
      })
    }

    const inspection = await prisma.productInspection.findUnique({
      where: { id: inspectionId },
    })

    if (!inspection) throw new Error('Inspection not found')

    // 2. Generate Localization Text
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: { responseMimeType: 'application/json' },
    })

    const prompt = `
      You are an expert in international product compliance and localization.

      Original product analysis: ${JSON.stringify(inspection.originalData)}
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
    const imagePart = bufferToInlineData(inspection.images[0])

    const result = await model.generateContent([prompt, imagePart])
    const localizationData = JSON.parse(result.response.text()) as LocalizationData

    await prisma.localizedVariant.update({
      where: { id: variant.id },
      data: {
        status: InspectionStatus.GENERATING,
        localizedText: localizationData,
      },
    })

    // 3. Generate Localized Image
    // NOTE: Using a placeholder for "Nano Banana Pro" image generation as per plan.
    // In a real scenario, we would call the image generation API here.

    const generatedImageBuffer = await generateLocalizedImage(
      inspection.images[0],
      localizationData,
      region
    )

    // 4. Save Results
    await prisma.localizedVariant.update({
      where: { id: variant.id },
      data: {
        status: InspectionStatus.COMPLETED,
        generatedImage: new Uint8Array(generatedImageBuffer),
      },
    })

    return localizationData
  } catch (error) {
    console.error(`Error localizing for ${region}:`, error)
    // Find the variant again to ensure we have the ID if it was created
    const variant = await prisma.localizedVariant.findFirst({
      where: { inspectionId, region },
    })
    if (variant) {
      await prisma.localizedVariant.update({
        where: { id: variant.id },
        data: { status: InspectionStatus.FAILED },
      })
    }
    throw error
  }
}

// Mock/Placeholder for Image Generation
async function generateLocalizedImage(
  originalImage: Uint8Array,
  localizationData: LocalizationData,
  region: string
): Promise<Buffer> {
  // In a real implementation, this would:
  // 1. Call an Image Gen API (e.g. Imagen, DALL-E, Stability)
  // 2. Pass the original image + prompt based on localizationData
  // 3. Return the generated image buffer.

  // For now, we'll return the original image modified slightly or just the original
  // to simulate a result.
  // Note: Returning original image for MVP flow to work without credits/API.

  console.log(`Generating image for ${region} with data:`, localizationData)

  // Simulating processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return Buffer.from(originalImage)
}
