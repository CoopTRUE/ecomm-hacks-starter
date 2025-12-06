import { error, json } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'

export async function GET({ params: { storeId } }) {
  const storeInformation = await prisma.storeInformation.findUnique({
    where: { id: storeId },
    select: {
      status: true,
    },
  })
  if (!storeInformation) {
    return error(404, 'Store information not found')
  }
  return json({ status: storeInformation.status })
}
