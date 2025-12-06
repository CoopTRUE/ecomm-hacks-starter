import { error, json } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'

export async function GET({ params }) {
  const { id } = params

  const storeInformation = await prisma.storeInformation.findUnique({
    where: { id },
    include: { variants: true },
  })

  if (!storeInformation) {
    return error(404, 'Store information not found')
  }

  return json(storeInformation)
}
