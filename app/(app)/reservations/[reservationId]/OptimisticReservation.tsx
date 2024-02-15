'use client'

import { useOptimistic, useState } from 'react'
import { TAddOptimistic } from '@/app/(app)/reservations/useOptimisticReservations'
import { type Reservation } from '@/lib/db/schema/reservations'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import Modal from '@/components/shared/Modal'
import ReservationForm from '@/components/reservations/ReservationForm'
import { type Restaurant, type RestaurantId } from '@/lib/db/schema/restaurants'

export default function OptimisticReservation({
  reservation,
  restaurants,
  restaurantId,
}: {
  reservation: Reservation

  restaurants: Restaurant[]
  restaurantId?: RestaurantId
}) {
  const [open, setOpen] = useState(false)
  const openModal = (_?: Reservation) => {
    setOpen(true)
  }
  const closeModal = () => setOpen(false)
  const [optimisticReservation, setOptimisticReservation] = useOptimistic(reservation)
  const updateReservation: TAddOptimistic = (input) =>
    setOptimisticReservation({ ...input.data })

  return (
    <div className='m-4'>
      <Modal open={open} setOpen={setOpen}>
        <ReservationForm
          reservation={optimisticReservation}
          restaurants={restaurants}
          restaurantId={restaurantId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateReservation}
        />
      </Modal>
      <div className='flex justify-between items-end mb-4'>
        <h1 className='font-semibold text-2xl'>{optimisticReservation.name}</h1>
        <Button className='' onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          'bg-secondary p-4 rounded-lg break-all text-wrap',
          optimisticReservation.id === 'optimistic' ? 'animate-pulse' : ''
        )}
      >
        {JSON.stringify(optimisticReservation, null, 2)}
      </pre>
    </div>
  )
}
