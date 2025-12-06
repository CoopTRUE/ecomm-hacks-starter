import { redirect } from '@sveltejs/kit'

export async function load({ params: { storeId }, parent }) {
  const { status } = await parent()
  if (
    status === 'PENDING' ||
    status === 'ANALYZING' ||
    status === 'ANALYZED' ||
    status === 'ANALYSIS_FAILED'
  ) {
    redirect(302, `/app/${storeId}`)
  }
}
