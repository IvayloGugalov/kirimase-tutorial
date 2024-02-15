import { reviewSchema } from '@/zodAutoGenSchemas'
import { z } from 'zod'
import { timestamps } from '@/lib/utils'
import { getReviews } from '@/lib/api/reviews/queries'

// Schema for reviews - used to validate API requests
const baseSchema = reviewSchema.omit(timestamps)

export const insertReviewSchema = baseSchema.omit({ id: true })
export const insertReviewParams = baseSchema
  .extend({
    rating: z.coerce.number(),
    reservationId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
    userId: true,
  })

export const updateReviewSchema = baseSchema
export const updateReviewParams = updateReviewSchema
  .extend({
    rating: z.coerce.number(),
    reservationId: z.coerce.string().min(1),
  })
  .omit({
    userId: true,
  })
export const reviewIdSchema = baseSchema.pick({ id: true })

// Types for reviews - used to type API request params and within Components
export type Review = z.infer<typeof reviewSchema>
export type NewReview = z.infer<typeof insertReviewSchema>
export type NewReviewParams = z.infer<typeof insertReviewParams>
export type UpdateReviewParams = z.infer<typeof updateReviewParams>
export type ReviewId = z.infer<typeof reviewIdSchema>['id']

// this type infers the return from getReviews() - meaning it will include any joins
export type CompleteReview = Awaited<ReturnType<typeof getReviews>>['reviews'][number]
