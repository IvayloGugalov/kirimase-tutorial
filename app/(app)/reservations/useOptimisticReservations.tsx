import { type Restaurant } from "@/lib/db/schema/restaurants";
import { type Reservation, type CompleteReservation } from "@/lib/db/schema/reservations";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Reservation>) => void;

export const useOptimisticReservations = (
  reservations: CompleteReservation[],
  restaurants: Restaurant[]
) => {
  const [optimisticReservations, addOptimisticReservation] = useOptimistic(
    reservations,
    (
      currentState: CompleteReservation[],
      action: OptimisticAction<Reservation>,
    ): CompleteReservation[] => {
      const { data } = action;

      const optimisticRestaurant = restaurants.find(
        (restaurant) => restaurant.id === data.restaurantId,
      )!;

      const optimisticReservation = {
        ...data,
        restaurant: optimisticRestaurant,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticReservation]
            : [...currentState, optimisticReservation];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticReservation } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticReservation, optimisticReservations };
};
