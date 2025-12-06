import { redirect } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma.js'

export async function load({ params: { storeId } }) {
  const storeInformation = await prisma.storeInformation.findUnique({
    where: { id: storeId },
    include: { variants: true },
  })
  if (!storeInformation) {
    redirect(302, '/')
  }
  return {
    status: storeInformation.status,
  }
}
