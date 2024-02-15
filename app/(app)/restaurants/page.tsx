import { Suspense } from 'react'

import Loading from '@/app/loading'
import RestaurantList from '@/components/restaurants/RestaurantList'
import { getRestaurants } from '@/lib/api/restaurants/queries'

export const revalidate = 0

export default async function RestaurantsPage() {
  return (
    <main>
      <div className='relative'>
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl my-2'>Restaurants</h1>
        </div>
        <Restaurants />
      </div>
    </main>
  )
}

const Restaurants = async () => {
  const { restaurants } = await getRestaurants()

  return (
    <Suspense fallback={<Loading />}>
      <RestaurantList restaurants={restaurants} />
    </Suspense>
  )
}
