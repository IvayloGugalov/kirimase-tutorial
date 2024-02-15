import { type Reservation } from '@/lib/db/schema/reservations'
import { type Review, type CompleteReview } from '@/lib/db/schema/reviews'
import { OptimisticAction } from '@/lib/utils'
import { useOptimistic } from 'react'

export type TAddOptimistic = (action: OptimisticAction<Review>) => void

export const useOptimisticReviews = (
  reviews: CompleteReview[],
  reservations: Reservation[]
) => {
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviews,
    (
      currentState: CompleteReview[],
      action: OptimisticAction<Review>
    ): CompleteReview[] => {
      const { data } = action

      const optimisticReservation = reservations.find(
        (reservation) => reservation.id === data.reservationId
      )!

      const optimisticReview = {
        ...data,
        reservation: optimisticReservation,
        id: 'optimistic',
      }

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticReview]
            : [...currentState, optimisticReview]
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticReview } : item
          )
        case 'delete':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: 'delete' } : item
          )
        default:
          return currentState
      }
    }
  )

  return { addOptimisticReview, optimisticReviews }
}
