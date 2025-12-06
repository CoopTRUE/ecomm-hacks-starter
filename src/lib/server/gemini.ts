import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAICacheManager, GoogleAIFileManager } from '@google/generative-ai/server' // For files/caching
import { GOOGLE_GEMINI_KEY } from '$env/static/private'

export const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_KEY)
export const gemini3ProModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' })
