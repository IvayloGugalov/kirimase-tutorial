import { getReservationById, getReservations } from '@/lib/api/reservations/queries'
import { publicProcedure, router } from '@/lib/server/trpc'
import {
  reservationIdSchema,
  insertReservationParams,
  updateReservationParams,
} from '@/lib/db/schema/reservations'
import {
  createReservation,
  deleteReservation,
  updateReservation,
} from '@/lib/api/reservations/mutations'

export const reservationsRouter = router({
  getReservations: publicProcedure.query(async () => {
    return getReservations()
  }),
  getReservationById: publicProcedure
    .input(reservationIdSchema)
    .query(async ({ input }) => {
      return getReservationById(input.id)
    }),
  createReservation: publicProcedure
    .input(insertReservationParams)
    .mutation(async ({ input }) => {
      return createReservation(input)
    }),
  updateReservation: publicProcedure
    .input(updateReservationParams)
    .mutation(async ({ input }) => {
      return updateReservation(input.id, input)
    }),
  deleteReservation: publicProcedure
    .input(reservationIdSchema)
    .mutation(async ({ input }) => {
      return deleteReservation(input.id)
    }),
})
