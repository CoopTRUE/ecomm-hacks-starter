import { error, json } from '@sveltejs/kit'
import { MAX_FILE_SIZE, MAX_FILES } from '$lib/constants'
import { prisma } from '$lib/server/prisma'
import captureWebsite from 'capture-website'
import { z } from 'zod'

const schema = z
  .object({
    images: z
      .array(z.file().min(1).max(MAX_FILE_SIZE).mime('image/jpeg'))
      .max(MAX_FILES)
      .default([]),
    urls: z
      .array(
        z.url().refine(
          (url) => {
            const u = new URL(url)
            return !(
              u.hostname === 'localhost' ||
              u.hostname === '127.0.0.1' ||
              u.hostname === '[::1]' ||
              u.hostname.endsWith('.localhost')
            )
          },
          { message: 'URL must not be a local address' }
        )
      )
      .default([]),
  })
  .refine((data) => data.images.length || data.urls.length, {
    message: 'At least one image or URL is required',
  })

export async function POST({ request }) {
  const formData = Object.fromEntries(await request.formData())
  const uncheckedFiles = Object.entries(formData)
    .filter(([key]) => key.startsWith('files['))
    .map(([_, value]) => value)
  const uncheckedUrls = Object.entries(formData)
    .filter(([key]) => key.startsWith('urls['))
    .map(([_, value]) => value)

  const parsed = schema.safeParse({ images: uncheckedFiles, urls: uncheckedUrls })
  if (!parsed.success) {
    return error(400, parsed.error.issues[0].message)
  }

  const { images, urls } = parsed.data

  const imageArrays: Uint8Array<ArrayBuffer>[] = []

  // Process uploaded files
  for (const file of images) {
    if (file instanceof File) {
      try {
        const buffer = await file.arrayBuffer()
        // const compressed = await sharp(buffer)
        //   .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        //   .jpeg({ quality: 80 })
        //   .toBuffer()
        imageArrays.push(new Uint8Array(buffer))
      } catch (e) {
        console.error('Failed to compress uploaded image:', e)
      }
    }
  }

  // Process URLs
  await Promise.all(
    urls.map(async (url) => {
      try {
        const buffer = await captureWebsite.buffer(url, { type: 'jpeg', delay: 3 })
        // const compressed = await sharp(buffer)
        //   .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        //   .jpeg({ quality: 80 })
        //   .toBuffer()
        imageArrays.push(new Uint8Array(buffer))
      } catch (e) {
        console.error(`Failed to capture/compress ${url}:`, e)
        // Proceed without this image or fail? For now, log and ignore
      }
    })
  )

  if (imageArrays.length === 0) {
    return error(400, 'No valid images provided or generated from URLs')
  }

  const inspection = await prisma.storeInformation.create({
    data: {
      images: imageArrays,
    },
  })

  return json({ id: inspection.id })
}
