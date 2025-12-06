import 'dotenv/config'
import { PrismaClient } from '../../../prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

export * from '../../../prisma/generated/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })
