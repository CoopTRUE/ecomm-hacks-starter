import { error, json } from '@sveltejs/kit'
import { localizeStore } from '$lib/server/localize.js'
import { CountryCode, prisma, StoreStatus } from '$lib/server/prisma.js'
import { z } from 'zod'

const schema = z.object({
  regions: z.array(z.enum(CountryCode)),
})

export async function POST({ params: { storeId }, request }) {
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return error(400, parsed.error.issues[0].message)
  }
  const { regions } = parsed.data
  const store = await prisma.storeInformation.findUnique({
    where: {
      id: storeId,
      status: {
        in: [
          // StoreStatus.ANALYZED,
          StoreStatus.PENDING,
          StoreStatus.LOCALIZATION_FAILED,
        ],
      },
    },
  })
  if (!store) {
    return error(404, 'Store information not found')
  }
  void localizeStore(store, regions)
  return json({ message: 'Starting localization process' })
}
