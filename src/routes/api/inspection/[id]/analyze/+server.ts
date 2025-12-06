import { error, json } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'

export async function POST({ params }) {
  const { id } = params

  const inspection = await prisma.productInspection.findUnique({
    where: { id },
  })

  if (!inspection) {
    return error(404, 'Inspection not found')
  }

  // TODO: Trigger Gemini analysis here
  // const analysisResult = await analyzeProduct(inspection.images)

  // Mock result for now
  const mockAnalysis = {
    name: 'Sample Product',
    description: 'A sample product for testing.',
    category: 'Food',
    language: 'en',
    ingredients: ['Sugar', 'Spice'],
  }

  await prisma.productInspection.update({
    where: { id },
    data: {
      status: 'ANALYZED',
      name: mockAnalysis.name,
      originalData: mockAnalysis,
    },
  })

  return json({ success: true })
}
