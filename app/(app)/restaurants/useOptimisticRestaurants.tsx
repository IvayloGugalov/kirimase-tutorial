import { type Restaurant, type CompleteRestaurant } from '@/lib/db/schema/restaurants'
import { OptimisticAction } from '@/lib/utils'
import { useOptimistic } from 'react'

export type TAddOptimistic = (action: OptimisticAction<Restaurant>) => void

export const useOptimisticRestaurants = (restaurants: CompleteRestaurant[]) => {
  const [optimisticRestaurants, addOptimisticRestaurant] = useOptimistic(
    restaurants,
    (
      currentState: CompleteRestaurant[],
      action: OptimisticAction<Restaurant>
    ): CompleteRestaurant[] => {
      const { data } = action

      const optimisticRestaurant = {
        ...data,

        id: 'optimistic',
      }

      switch (action.action) {
        case 'create':
          return currentState.length === 0
            ? [optimisticRestaurant]
            : [...currentState, optimisticRestaurant]
        case 'update':
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticRestaurant } : item
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

  return { addOptimisticRestaurant, optimisticRestaurants }
}
