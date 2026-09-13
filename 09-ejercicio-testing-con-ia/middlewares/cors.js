import cors from 'cors'
import { ACCEPTED_ORIGINS } from '../config.js'

export const corsMiddleware = () => {
  return cors({
    origin: ACCEPTED_ORIGINS
  })
}