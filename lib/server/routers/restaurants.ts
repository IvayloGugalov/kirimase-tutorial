import { getRestaurantById, getRestaurants } from "@/lib/api/restaurants/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  restaurantIdSchema,
  insertRestaurantParams,
  updateRestaurantParams,
} from "@/lib/db/schema/restaurants";
import { createRestaurant, deleteRestaurant, updateRestaurant } from "@/lib/api/restaurants/mutations";

export const restaurantsRouter = router({
  getRestaurants: publicProcedure.query(async () => {
    return getRestaurants();
  }),
  getRestaurantById: publicProcedure.input(restaurantIdSchema).query(async ({ input }) => {
    return getRestaurantById(input.id);
  }),
  createRestaurant: publicProcedure
    .input(insertRestaurantParams)
    .mutation(async ({ input }) => {
      return createRestaurant(input);
    }),
  updateRestaurant: publicProcedure
    .input(updateRestaurantParams)
    .mutation(async ({ input }) => {
      return updateRestaurant(input.id, input);
    }),
  deleteRestaurant: publicProcedure
    .input(restaurantIdSchema)
    .mutation(async ({ input }) => {
      return deleteRestaurant(input.id);
    }),
});
