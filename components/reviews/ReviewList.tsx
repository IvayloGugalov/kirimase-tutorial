'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { type Review, CompleteReview } from '@/lib/db/schema/reviews'
import Modal from '@/components/shared/Modal'
import { type Reservation, type ReservationId } from '@/lib/db/schema/reservations'
import { useOptimisticReviews } from '@/app/(app)/reviews/useOptimisticReviews'
import { Button } from '@/components/ui/button'
import ReviewForm from './ReviewForm'
import { PlusIcon } from 'lucide-react'

type TOpenModal = (review?: Review) => void

export default function ReviewList({
  review,
  reservations,
  reservationId,
}: {
  review: CompleteReview
  reservations: Reservation[]
  reservationId?: ReservationId
}) {
  const { optimisticReviews, addOptimisticReview } = useOptimisticReviews(
    review,
    reservations
  )
  const [open, setOpen] = useState(false)
  const [activeReview, setActiveReview] = useState<Review | null>(null)
  const openModal = (review?: Review) => {
    setOpen(true)
    review ? setActiveReview(review) : setActiveReview(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeReview ? 'Edit Review' : 'Create Review'}
      >
        <ReviewForm
          review={activeReview}
          addOptimistic={addOptimisticReview}
          openModal={openModal}
          closeModal={closeModal}
          reservations={reservations}
          reservationId={reservationId}
        />
      </Modal>
      <div className='absolute right-0 top-0 '>
        <Button onClick={() => openModal()} variant={'outline'}>
          +
        </Button>
      </div>
      {optimisticReviews.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticReviews.map((review) => (
            <Review review={review} key={review.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  )
}

const Review = ({
  review,
  openModal,
}: {
  review: CompleteReview
  openModal: TOpenModal
}) => {
  const optimistic = review.id === 'optimistic'
  const deleting = review.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('reviews') ? pathname : pathname + '/reviews/'

  return (
    <li
      className={cn(
        'flex justify-between my-2',
        mutating ? 'opacity-30 animate-pulse' : '',
        deleting ? 'text-destructive' : ''
      )}
    >
      <div className='w-full'>
        <div>{review.information}</div>
      </div>
      <Button variant={'link'} asChild>
        <Link href={basePath + '/' + review.id}>Edit</Link>
      </Button>
    </li>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>
        No reviews
      </h3>
      <p className='mt-1 text-sm text-muted-foreground'>
        Get started by creating a new review.
      </p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Reviews{' '}
        </Button>
      </div>
    </div>
  )
}
