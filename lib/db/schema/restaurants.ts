import { restaurantSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getRestaurants } from "@/lib/api/restaurants/queries";


// Schema for restaurants - used to validate API requests
const baseSchema = restaurantSchema.omit(timestamps)

export const insertRestaurantSchema = baseSchema.omit({ id: true });
export const insertRestaurantParams = baseSchema.extend({
  rating: z.coerce.number()
}).omit({ 
  id: true
});

export const updateRestaurantSchema = baseSchema;
export const updateRestaurantParams = updateRestaurantSchema.extend({
  rating: z.coerce.number()
})
export const restaurantIdSchema = baseSchema.pick({ id: true });

// Types for restaurants - used to type API request params and within Components
export type Restaurant = z.infer<typeof restaurantSchema>;
export type NewRestaurant = z.infer<typeof insertRestaurantSchema>;
export type NewRestaurantParams = z.infer<typeof insertRestaurantParams>;
export type UpdateRestaurantParams = z.infer<typeof updateRestaurantParams>;
export type RestaurantId = z.infer<typeof restaurantIdSchema>["id"];
    
// this type infers the return from getRestaurants() - meaning it will include any joins
export type CompleteRestaurant = Awaited<ReturnType<typeof getRestaurants>>["restaurants"][number];

