"use server";

import { revalidatePath } from "next/cache";
import {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from "@/lib/api/restaurants/mutations";
import {
  RestaurantId,
  NewRestaurantParams,
  UpdateRestaurantParams,
  restaurantIdSchema,
  insertRestaurantParams,
  updateRestaurantParams,
} from "@/lib/db/schema/restaurants";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateRestaurants = () => revalidatePath("/restaurants");

export const createRestaurantAction = async (input: NewRestaurantParams) => {
  try {
    const payload = insertRestaurantParams.parse(input);
    await createRestaurant(payload);
    revalidateRestaurants();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateRestaurantAction = async (input: UpdateRestaurantParams) => {
  try {
    const payload = updateRestaurantParams.parse(input);
    await updateRestaurant(payload.id, payload);
    revalidateRestaurants();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteRestaurantAction = async (input: RestaurantId) => {
  try {
    const payload = restaurantIdSchema.parse({ id: input });
    await deleteRestaurant(payload.id);
    revalidateRestaurants();
  } catch (e) {
    return handleErrors(e);
  }
};