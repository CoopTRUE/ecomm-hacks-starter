import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { prisma } from '$lib/server/prisma'

export const GET: RequestHandler = async ({ params }) => {
  const { storeId } = params

  const store = await prisma.storeInformation.findUnique({
    where: { id: storeId },
    include: {
      variants: true,
    },
  })

  if (!store) {
    return json({ error: 'Store not found' }, { status: 404 })
  }

  // Helper to convert Buffer to base64
  const toBase64 = (buffer: Uint8Array | null) => {
    if (!buffer) return null
    return Buffer.from(buffer).toString('base64')
  }

  // Transform images to base64 for frontend
  const imagesBase64 = store.images.map((img) => toBase64(img))

  const variants = store.variants.map((variant) => ({
    ...variant,
    generatedImages: variant.generatedImages.map((img) => toBase64(img)),
  }))

  return json({
    ...store,
    images: imagesBase64,
    variants,
  })
}
