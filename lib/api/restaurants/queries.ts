import { db } from '@/lib/db/index'
import { type RestaurantId, restaurantIdSchema } from '@/lib/db/schema/restaurants'

export const getRestaurants = async () => {
  const r = await db.restaurant.findMany({})
  return { restaurants: r }
}

export const getRestaurantById = async (id: RestaurantId) => {
  const { id: restaurantId } = restaurantIdSchema.parse({ id })
  const r = await db.restaurant.findFirst({
    where: { id: restaurantId },
  })
  return { restaurant: r }
}

export const getRestaurantByIdWithReservations = async (id: RestaurantId) => {
  const { id: restaurantId } = restaurantIdSchema.parse({ id })
  const r = await db.restaurant.findFirst({
    where: { id: restaurantId },
    include: { reservations: { include: { restaurant: true } } },
  })
  if (r === null) return { restaurant: null }
  const { reservations, ...restaurant } = r

  return { restaurant, reservations: reservations }
}
