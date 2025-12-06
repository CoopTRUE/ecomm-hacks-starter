import { redirect } from '@sveltejs/kit'

export async function load({ params: { storeId }, parent }) {
  const { status } = await parent()
  if (status === 'LOCALIZING' || status === 'LOCALIZED' || status === 'LOCALIZATION_FAILED') {
    redirect(302, `/app/${storeId}/variants`)
  }
}
