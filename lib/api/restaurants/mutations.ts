import { db } from "@/lib/db/index";
import { 
  RestaurantId, 
  NewRestaurantParams,
  UpdateRestaurantParams, 
  updateRestaurantSchema,
  insertRestaurantSchema, 
  restaurantIdSchema 
} from "@/lib/db/schema/restaurants";

export const createRestaurant = async (restaurant: NewRestaurantParams) => {
  const newRestaurant = insertRestaurantSchema.parse(restaurant);
  try {
    const r = await db.restaurant.create({ data: newRestaurant });
    return { restaurant: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateRestaurant = async (id: RestaurantId, restaurant: UpdateRestaurantParams) => {
  const { id: restaurantId } = restaurantIdSchema.parse({ id });
  const newRestaurant = updateRestaurantSchema.parse(restaurant);
  try {
    const r = await db.restaurant.update({ where: { id: restaurantId }, data: newRestaurant})
    return { restaurant: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteRestaurant = async (id: RestaurantId) => {
  const { id: restaurantId } = restaurantIdSchema.parse({ id });
  try {
    const r = await db.restaurant.delete({ where: { id: restaurantId }})
    return { restaurant: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

