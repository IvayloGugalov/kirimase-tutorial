import * as z from 'zod'
import { CompleteReservation, relatedReservationSchema } from './index'

export const reviewSchema = z.object({
  id: z.string(),
  information: z.string(),
  rating: z.number().int().nullish(),
  restaurantId: z.string(),
  reservationId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteReview extends z.infer<typeof reviewSchema> {
  reservation: CompleteReservation
}

/**
 * relatedReviewSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedReviewSchema: z.ZodSchema<CompleteReview> = z.lazy(() =>
  reviewSchema.extend({
    reservation: relatedReservationSchema,
  })
)
