import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getReviewById } from '@/lib/api/reviews/queries'
import { getReservations } from '@/lib/api/reservations/queries'
import OptimisticReview from '@/app/(app)/reviews/[reviewId]/OptimisticReview'
import { checkAuth } from '@/lib/auth/utils'

import { BackButton } from '@/components/shared/BackButton'
import Loading from '@/app/loading'

export const revalidate = 0

export default async function ReviewPage({ params }: { params: { reviewId: string } }) {
  return (
    <main className='overflow-auto'>
      <Review id={params.reviewId} />
    </main>
  )
}

const Review = async ({ id }: { id: string }) => {
  await checkAuth()

  const { review } = await getReviewById(id)
  const { reservations } = await getReservations()

  if (!review) notFound()
  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        <BackButton currentResource='reviews' />
        <OptimisticReview
          review={review}
          reservations={reservations}
          reservationId={review.reservationId}
        />
      </div>
    </Suspense>
  )
}
