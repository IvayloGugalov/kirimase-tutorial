import { getReviewById, getReviews } from '@/lib/api/reviews/queries'
import { publicProcedure, router } from '@/lib/server/trpc'
import {
  reviewIdSchema,
  insertReviewParams,
  updateReviewParams,
} from '@/lib/db/schema/reviews'
import { createReview, deleteReview, updateReview } from '@/lib/api/reviews/mutations'

export const reviewsRouter = router({
  getReviews: publicProcedure.query(async () => {
    return getReviews()
  }),
  getReviewById: publicProcedure.input(reviewIdSchema).query(async ({ input }) => {
    return getReviewById(input.id)
  }),
  createReview: publicProcedure
    .input(insertReviewParams)
    .mutation(async ({ input }) => {
      return createReview(input)
    }),
  updateReview: publicProcedure
    .input(updateReviewParams)
    .mutation(async ({ input }) => {
      return updateReview(input.id, input)
    }),
  deleteReview: publicProcedure.input(reviewIdSchema).mutation(async ({ input }) => {
    return deleteReview(input.id)
  }),
})
