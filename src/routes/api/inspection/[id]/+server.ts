import { error, json } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'

export async function GET({ params }) {
  const { id } = params

  const inspection = await prisma.productInspection.findUnique({
    where: { id },
    include: { variants: true },
  })

  if (!inspection) {
    return error(404, 'Inspection not found')
  }

  return json(inspection)
}
