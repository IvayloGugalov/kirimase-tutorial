import { reservationSchema } from '@/zodAutoGenSchemas'
import { z } from 'zod'
import { timestamps } from '@/lib/utils'
import { getReservations } from '@/lib/api/reservations/queries'

// Schema for reservations - used to validate API requests
const baseSchema = reservationSchema.omit(timestamps)

export const insertReservationSchema = baseSchema.omit({ id: true })
export const insertReservationParams = baseSchema
  .extend({
    occupants: z.coerce.number(),
    reservationDate: z.coerce.date(),
    restaurantId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
    userId: true,
  })

export const updateReservationSchema = baseSchema
export const updateReservationParams = updateReservationSchema
  .extend({
    occupants: z.coerce.number(),
    reservationDate: z.coerce.date(),
    restaurantId: z.coerce.string().min(1),
  })
  .omit({
    userId: true,
  })
export const reservationIdSchema = baseSchema.pick({ id: true })

// Types for reservations - used to type API request params and within Components
export type Reservation = z.infer<typeof reservationSchema>
export type NewReservation = z.infer<typeof insertReservationSchema>
export type NewReservationParams = z.infer<typeof insertReservationParams>
export type UpdateReservationParams = z.infer<typeof updateReservationParams>
export type ReservationId = z.infer<typeof reservationIdSchema>['id']

// this type infers the return from getReservations() - meaning it will include any joins
export type CompleteReservation = Awaited<
  ReturnType<typeof getReservations>
>['reservations'][number]
