import type { CountryConversion } from '../../../../../../prisma/generated/client'
import { error, json } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'

export async function POST({ request, params }) {
  const { id } = params
  const body = await request.json()
  const { regions } = body as { regions: CountryConversion[] }

  if (!regions || !regions.length) {
    return error(400, 'Regions required')
  }

  const inspection = await prisma.productInspection.findUnique({
    where: { id },
  })

  if (!inspection) {
    return error(404, 'Inspection not found')
  }

  await prisma.productInspection.update({
    where: { id },
    data: { status: 'GENERATING' },
  })

  const variants = await Promise.all(
    regions.map(async (region) => {
      return await prisma.localizedVariant.create({
        data: {
          inspectionId: id,
          region,
          status: 'PENDING',
        },
      })
    })
  )

  // TODO: Trigger generation for each variant async
  // generateVariants(variants, inspection)

  return json({ success: true, variants })
}
