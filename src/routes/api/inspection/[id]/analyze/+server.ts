import { error, json } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'
import { analyzeProduct } from '$lib/server/functions'

export async function POST({ params }) {
  const { id } = params

  const inspection = await prisma.productInspection.findUnique({
    where: { id },
  })

  if (!inspection) {
    return error(404, 'Inspection not found')
  }

  try {
    const analysisResult = await analyzeProduct(id)
    return json(analysisResult)
  } catch (e) {
    console.error(e)
    return error(500, 'Analysis failed')
  }
}
