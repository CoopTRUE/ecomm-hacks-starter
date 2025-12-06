import { error } from '@sveltejs/kit'
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

  // TODO: Generate ZIP file containing:
  // - Original images
  // - Generated images for each variant
  // - JSON metadata/translations

  // For now returning a placeholder
  return new Response('Zip download placeholder', {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="inspection-${id}.txt"`,
    },
  })
}
