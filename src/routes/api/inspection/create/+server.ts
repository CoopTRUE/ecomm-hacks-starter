import { error, json } from '@sveltejs/kit'
import { MAX_FILE_SIZE, MAX_FILES } from '$lib/constants'
import { prisma } from '$lib/server/prisma'
import captureWebsite from 'capture-website'
import { z } from 'zod'

const schema = z
  .object({
    images: z
      .array(z.file().min(1).max(MAX_FILE_SIZE).mime('image/png'))
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

  const imageBuffers: Buffer[] = []

  // Process uploaded files
  for (const file of images) {
    if (file instanceof File) {
      imageBuffers.push(Buffer.from(await file.arrayBuffer()))
    }
  }

  // Process URLs
  await Promise.all(
    urls.map(async (url) => {
      try {
        const buffer = await captureWebsite.buffer(url, { delay: 3, type: 'png' })
        imageBuffers.push(Buffer.from(buffer))
      } catch (e) {
        console.error(`Failed to capture ${url}:`, e)
        // Proceed without this image or fail? For now, log and ignore
      }
    })
  )

  if (imageBuffers.length === 0) {
    return error(400, 'No valid images provided or generated from URLs')
  }

  const inspection = await prisma.productInspection.create({
    data: {
      images: imageBuffers,
      status: 'PENDING',
    },
  })

  return json({ success: true, id: inspection.id })
}
