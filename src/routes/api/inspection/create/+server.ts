import { z } from 'zod'

// const schema = z.object({
//   images: z.array(z.file().min(1).max(10).mime("image")
// })

export async function POST({ request }) {
  const formData = await request.formData()
  const name = formData.get('name')
  const images = formData.get('images')
  return { name, images }
}
