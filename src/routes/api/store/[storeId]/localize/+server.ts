import { error, json } from '@sveltejs/kit'
import { analyzeStore } from '$lib/server/functions.js'
import { CountryCode, prisma } from '$lib/server/prisma'
import { z } from 'zod'

const schema = z.object({
  regions: z.array(z.enum(CountryCode)),
})

export async function POST({ params: { storeId }, request }) {
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return error(400, parsed.error.issues[0].message)
  }

  const storeInformation = await prisma.storeInformation.findUnique({
    where: { id: storeId },
  })
  if (!storeInformation) {
    return error(404, 'Store information not found')
  }
  await analyzeStore(storeId)
  return json({ message: 'Store analyzed' })

  // const regions = parsed.data.regions
  // for (const region of regions) {
  //   await localizeProduct(storeId, region)
  // }
}
