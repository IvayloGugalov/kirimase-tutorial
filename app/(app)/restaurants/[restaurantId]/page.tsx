import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getRestaurantByIdWithReservations } from '@/lib/api/restaurants/queries'
import OptimisticRestaurant from './OptimisticRestaurant'
import ReservationList from '@/components/reservations/ReservationList'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function RestaurantPage({
  params,
}: {
  params: { restaurantId: string }
}) {
  return (
    <main className='overflow-auto'>
      <Restaurant id={params.restaurantId} />
    </main>
  )
}

const Restaurant = async ({ id }: { id: string }) => {
  const { restaurant, reservations } = await getRestaurantByIdWithReservations(id)

  if (!restaurant) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='restaurants' />
        <OptimisticRestaurant restaurant={restaurant} />
      </div>
      <div className='relative mt-8 mx-4'>
        <h3 className='text-xl font-medium mb-4'>
          {restaurant.name}&apos;s Reservations
        </h3>
        <ReservationList
          restaurants={[]}
          restaurantId={restaurant.id}
          reservations={reservations}
        />
      </div>
    </Suspense>
  )
}
