import { db } from '@/lib/db/index'
import {
  ReviewId,
  NewReviewParams,
  UpdateReviewParams,
  updateReviewSchema,
  insertReviewSchema,
  reviewIdSchema,
} from '@/lib/db/schema/reviews'
import { getUserAuth } from '@/lib/auth/utils'

export const createReview = async (review: NewReviewParams) => {
  const { session } = await getUserAuth()
  const newReview = insertReviewSchema.parse({ ...review, userId: session?.user.id! })
  try {
    const r = await db.review.create({ data: newReview })
    return { review: r }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const updateReview = async (id: ReviewId, review: UpdateReviewParams) => {
  const { session } = await getUserAuth()
  const { id: reviewId } = reviewIdSchema.parse({ id })
  const newReview = updateReviewSchema.parse({ ...review, userId: session?.user.id! })
  try {
    const r = await db.review.update({
      where: { id: reviewId, userId: session?.user.id! },
      data: newReview,
    })
    return { review: r }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}

export const deleteReview = async (id: ReviewId) => {
  const { session } = await getUserAuth()
  const { id: reviewId } = reviewIdSchema.parse({ id })
  try {
    const r = await db.review.delete({
      where: { id: reviewId, userId: session?.user.id! },
    })
    return { review: r }
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again'
    console.error(message)
    throw { error: message }
  }
}
