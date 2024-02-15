import { computersRouter } from './computers'
import { router } from '@/lib/server/trpc'
import { restaurantsRouter } from './restaurants'
import { reservationsRouter } from './reservations'
import { reviewsRouter } from './reviews'

export const appRouter = router({
  computers: computersRouter,
  restaurants: restaurantsRouter,
  reservations: reservationsRouter,
  reviews: reviewsRouter,
})

export type AppRouter = typeof appRouter
