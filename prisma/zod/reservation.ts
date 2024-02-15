import * as z from "zod"
import { CompleteRestaurant, relatedRestaurantSchema, CompleteReview, relatedReviewSchema } from "./index"

export const reservationSchema = z.object({
  id: z.string(),
  name: z.string(),
  occupants: z.number().int(),
  description: z.string(),
  reservationDate: z.date(),
  status: z.string(),
  restaurantId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteReservation extends z.infer<typeof reservationSchema> {
  restaurant: CompleteRestaurant
  review?: CompleteReview | null
}

/**
 * relatedReservationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedReservationSchema: z.ZodSchema<CompleteReservation> = z.lazy(() => reservationSchema.extend({
  restaurant: relatedRestaurantSchema,
  review: relatedReviewSchema.nullish(),
}))
