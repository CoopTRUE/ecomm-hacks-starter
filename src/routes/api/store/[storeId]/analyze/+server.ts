// import { error, json } from '@sveltejs/kit'
// import { analyzeStore } from '$lib/server/functions.js'
// import { prisma, StoreStatus } from '$lib/server/prisma.js'

// export async function POST({ params: { storeId } }) {
//   const store = await prisma.storeInformation.findUnique({
//     where: {
//       id: storeId,
//       status: {
//         in: [StoreStatus.PENDING, StoreStatus.ANALYSIS_FAILED],
//       },
//     },
//   })
//   if (!store) {
//     return error(404, 'Store information not found')
//   }
//   void analyzeStore(store)
//   return json({ message: 'Starting analysis process' })
// }
