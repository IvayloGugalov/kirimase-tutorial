import { db } from '@/lib/db/index'
import { getUserAuth } from '@/lib/auth/utils'
import { type ReservationId, reservationIdSchema } from '@/lib/db/schema/reservations'

export const getReservations = async () => {
  const { session } = await getUserAuth()
  const r = await db.reservation.findMany({
    where: { userId: session?.user.id! },
    include: { restaurant: true },
  })
  return { reservations: r }
}

export const getReservationById = async (id: ReservationId) => {
  const { session } = await getUserAuth()
  const { id: reservationId } = reservationIdSchema.parse({ id })
  const r = await db.reservation.findFirst({
    where: { id: reservationId, userId: session?.user.id! },
    include: { restaurant: true },
  })
  return { reservation: r }
}

export const getReservationByIdWithReviews = async (id: ReservationId) => {
  const { session } = await getUserAuth()
  const { id: reservationId } = reservationIdSchema.parse({ id })
  const r = await db.reservation.findFirst({
    where: { id: reservationId, userId: session?.user.id! },
    include: {
      restaurant: { include: { reservations: true } },
      reviews: { include: { reservation: true } },
    },
  })
  if (r === null) return { reservation: null }
  const { restaurant, reviews, ...reservation } = r

  return { reservation, restaurant: restaurant, reviews: reviews }
}
