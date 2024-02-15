import * as z from "zod"
import { CompleteReservation, relatedReservationSchema } from "./index"

export const restaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().nullish(),
  description: z.string(),
  rating: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteRestaurant extends z.infer<typeof restaurantSchema> {
  reservations: CompleteReservation[]
}

/**
 * relatedRestaurantSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedRestaurantSchema: z.ZodSchema<CompleteRestaurant> = z.lazy(() => restaurantSchema.extend({
  reservations: relatedReservationSchema.array(),
}))
