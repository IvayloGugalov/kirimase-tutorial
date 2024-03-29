import { Suspense } from 'react'

import Loading from '@/app/loading'
import ReviewList from '@/components/reviews/ReviewList'
import { getReviews } from '@/lib/api/reviews/queries'
import { getReservations } from '@/lib/api/reservations/queries'
import { checkAuth } from '@/lib/auth/utils'

export const revalidate = 0

export default async function ReviewsPage() {
  return (
    <main>
      <div className='relative'>
        <div className='flex justify-between'>
          <h1 className='font-semibold text-2xl my-2'>Reviews</h1>
        </div>
        <Reviews />
      </div>
    </main>
  )
}

const Reviews = async () => {
  await checkAuth()

  const { reviews } = await getReviews()
  const { reservations } = await getReservations()
  return (
    <Suspense fallback={<Loading />}>
      <ReviewList reviews={reviews} reservations={reservations} />
    </Suspense>
  )
}
