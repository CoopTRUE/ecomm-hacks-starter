import { GoogleGenerativeAI } from '@google/generative-ai'
import { GOOGLE_GEMINI_KEY } from '$env/static/private'

export const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_KEY)
export const geminiTextModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: { responseMimeType: 'application/json' },
})
export const geminiImageModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-image',
})
