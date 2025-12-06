// import { geminiTextModel } from './gemini'
// import { prisma, type StoreInformation, StoreStatus } from './prisma'

// export interface LocalizationData {
//   translated_name: string
//   translated_description: string
//   regulatory_requirements: string[]
//   required_marks: string[]
//   warnings: string[]
//   placement_suggestions: string
// }

// // Helper to convert buffer to base64 for Gemini
// function bufferToInlineData(buffer: Uint8Array, mimeType = 'image/jpeg') {
//   return {
//     inlineData: {
//       data: Buffer.from(buffer).toString('base64'),
//       mimeType,
//     },
//   }
// }

// export async function analyzeStore({ id, images }: StoreInformation): Promise<string> {
//   // const store = await prisma.storeInformation.findUnique({
//   //   where: {
//   //     id: storeId,
//   //     status: {
//   //       in: [StoreStatus.PENDING, StoreStatus.FAILED],
//   //     },
//   //   },
//   // })

//   if (!images || images.length === 0) {
//     throw new Error('Store information not found or no images')
//   }

//   await prisma.storeInformation.update({
//     where: { id },
//     data: { status: StoreStatus.ANALYZING },
//   })

//   await new Promise((resolve) => setTimeout(resolve, 10000))

//   const prompt = `
//       Analyze this product image and extract the following information in JSON format:
//       1. product_name: The name of the product.
//       2. description: A brief description of the product.
//       3. text_content: All visible text on the packaging (preserve hierarchy).
//       4. category: Product category (food, electronics, cosmetics, etc.).
//       5. market: Current market/language inferred from the packaging.
//       6. compliance_marks: Any existing compliance marks visible (e.g., CE, FCC).
//       7. ingredients: Ingredients or materials list if present.
//     `

//   try {
//     // Use the first image for analysis
//     const imagePart = bufferToInlineData(images[0])

//     const { response } = await geminiTextModel.generateContent([prompt, imagePart])
//     const text = response.text()
//     await prisma.storeInformation.update({
//       where: { id },
//       data: { analysis: text, status: StoreStatus.ANALYZED },
//     })
//     console.log('Analysis:', text)
//     return text
//   } catch (error) {
//     console.error('Error analyzing product:', error)
//     await prisma.storeInformation.update({
//       where: { id },
//       data: { status: StoreStatus.ANALYSIS_FAILED },
//     })
//     throw error
//   }
// }
