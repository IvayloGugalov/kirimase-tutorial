import { db } from '@/lib/db/index'
import { getUserAuth } from '@/lib/auth/utils'
import { type ReviewId, reviewIdSchema } from '@/lib/db/schema/reviews'

export const getReviews = async () => {
  const { session } = await getUserAuth()
  const r = await db.review.findMany({
    where: { userId: session?.user.id! },
    include: { reservation: true },
  })
  return { reviews: r }
}

export const getReviewById = async (id: ReviewId) => {
  const { session } = await getUserAuth()
  const { id: reviewId } = reviewIdSchema.parse({ id })
  const r = await db.review.findFirst({
    where: { id: reviewId, userId: session?.user.id! },
    include: { reservation: true },
  })
  return { review: r }
}
