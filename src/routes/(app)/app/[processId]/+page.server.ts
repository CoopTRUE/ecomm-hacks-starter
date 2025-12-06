import { redirect } from '@sveltejs/kit'
import { InspectionStatus, prisma } from '$lib/server/prisma.js'

export async function load({ params: { processId } }) {
  const process = await prisma.productInspection.findUnique({
    where: {
      id: processId,
      status: InspectionStatus.PENDING,
    },
  })
  if (!process) {
    redirect(302, '/')
  }
}
