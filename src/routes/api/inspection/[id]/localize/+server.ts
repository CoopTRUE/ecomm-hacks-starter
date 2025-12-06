import { error, json } from '@sveltejs/kit'
import { localizeProduct } from '$lib/server/functions'
import { CountryConversion } from '$lib/server/prisma'

export async function POST({ request, params }) {
  const { id } = params
  const { region } = await request.json()

  if (!region || !Object.values(CountryConversion).includes(region)) {
    return error(400, 'Invalid region')
  }

  try {
    const result = await localizeProduct(id, region)
    return json(result)
  } catch (e) {
    console.error(e)
    return error(500, 'Localization failed')
  }
}
