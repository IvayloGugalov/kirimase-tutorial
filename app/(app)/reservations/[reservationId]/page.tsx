import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getReservationByIdWithReviews } from '@/lib/api/reservations/queries'
import { getRestaurants } from '@/lib/api/restaurants/queries'
import OptimisticReservation from '@/app/(app)/reservations/[reservationId]/OptimisticReservation'
import { checkAuth } from '@/lib/auth/utils'
import ReviewList from '@/components/reviews/ReviewList'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function ReservationPage({
  params,
}: {
  params: { reservationId: string }
}) {
  return (
    <main className='overflow-auto'>
      <Reservation id={params.reservationId} />
    </main>
  )
}

const Reservation = async ({ id }: { id: string }) => {
  await checkAuth()

  const { reservation, reviews } = await getReservationByIdWithReviews(id)
  const { restaurants } = await getRestaurants()

  if (!reservation) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='reservations' />
        <OptimisticReservation reservation={reservation} restaurants={restaurants} />
      </div>
      <div className='relative mt-8 mx-4'>
        <h3 className='text-xl font-medium mb-4'>{reservation.name}&apos;s Reviews</h3>
        <ReviewList
          reservations={[]}
          reservationId={reservation.id}
          reviews={reviews}
        />
      </div>
    </Suspense>
  )
}
