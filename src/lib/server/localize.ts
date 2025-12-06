import { geminiImageModel, geminiTextModel } from './gemini'
import { type CountryCode, prisma, type StoreInformation, StoreStatus } from './prisma'
import { EXTRACTION_PROMPT, IMAGE_GENERATION_PROMPT } from '$lib/constants'

function bufferToInlineData(buffer: Uint8Array, mimeType = 'image/jpeg') {
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType,
    },
  }
}

export async function localizeStore(store: StoreInformation, regions: CountryCode[]) {
  await prisma.storeInformation.update({
    where: { id: store.id },
    data: { status: StoreStatus.LOCALIZING },
  })

  try {
    const results = await Promise.allSettled(
      regions.map((region) => localizeImages(store.id, store.images, region))
    )
    console.log('LOCALIZED IMAGES', results)

    // Check if all failed
    const anyFailed = results.some((r) => r.status === 'rejected')
    if (anyFailed) {
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

export async function localizeImages(
  storeId: string,
  images: StoreInformation['images'],
  region: CountryCode
) {
  // We might pass the image again for context if needed, but the analysis data should suffice for text.
  // Passing image anyway for better context.
  const imageParts = images.map((image) => bufferToInlineData(image))
  console.log('CREATED', imageParts.length, 'IMAGE PARTS')

  const { response } = await geminiImageModel.generateContent([
    IMAGE_GENERATION_PROMPT(region),
    ...imageParts,
  ])
  console.log('GENERATED IMAGE PARTS')
  const { parts } = response.candidates![0].content
  const files: Buffer<ArrayBuffer>[] = []
  for (const part of parts) {
    const data = part.inlineData?.data
    if (!data) continue
    files.push(Buffer.from(data, 'base64'))
  }
  const localizedProductImageParts = files.map((file) => bufferToInlineData(file))
  console.log('GENERATED LOCALIZED PRODUCT IMAGE PARTS')
  // const { response: extractionResponse } = await geminiTextModel.generateContent([
  //   EXTRACTION_PROMPT,
  //   ...localizedProductImageParts,
  // ])
  // console.log('GENERATED EXTRACTION RESPONSE', extractionResponse.text())
  // const extractedTexts = JSON.parse(extractionResponse.text())
  await prisma.localizedVariant.create({
    data: {
      storeInformationId: storeId,
      region,
      generatedImages: files.map((file) => new Uint8Array(file)),
      localizedText: [],
    },
  })
}
