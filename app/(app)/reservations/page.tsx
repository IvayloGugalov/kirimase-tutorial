import { Suspense } from 'react'

import Loading from '@/app/loading'
import ReservationList from '@/components/reservations/ReservationList'
import { getReservations } from '@/lib/api/reservations/queries'
import { getRestaurants } from '@/lib/api/restaurants/queries'
import { checkAuth } from '@/lib/auth/utils'

export const revalidate = 0

export default async function ReservationsPage() {
  return (
    <main>
      <div className='relative'>
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl my-2'>Reservations</h1>
        </div>
        <Reservations />
      </div>
    </main>
  )
}

const Reservations = async () => {
  await checkAuth()

  const { reservations } = await getReservations()
  const { restaurants } = await getRestaurants()
  return (
    <Suspense fallback={<Loading />}>
      <ReservationList reservations={reservations} restaurants={restaurants} />
    </Suspense>
  )
}
