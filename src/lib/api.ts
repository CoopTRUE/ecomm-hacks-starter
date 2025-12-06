import { browser } from '$app/environment'
import axios from 'axios'

export const api = axios.create({
  baseURL: `${browser ? window.location.origin : 'http://localhost:3000'}/api`,
})
