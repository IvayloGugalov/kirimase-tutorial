'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { type Restaurant, CompleteRestaurant } from '@/lib/db/schema/restaurants'
import Modal from '@/components/shared/Modal'

import { useOptimisticRestaurants } from '@/app/(app)/restaurants/useOptimisticRestaurants'
import { Button } from '@/components/ui/button'
import RestaurantForm from './RestaurantForm'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'

type TOpenModal = (restaurant?: Restaurant) => void

export default function RestaurantList({ restaurants }: { restaurants: CompleteRestaurant[] }) {
  const { optimisticRestaurants, addOptimisticRestaurant } = useOptimisticRestaurants(restaurants)
  const [open, setOpen] = useState(false)
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null)
  const openModal = (restaurant?: Restaurant) => {
    setOpen(true)
    restaurant ? setActiveRestaurant(restaurant) : setActiveRestaurant(null)
  }
  const closeModal = () => setOpen(false)

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeRestaurant ? 'Edit Restaurant' : 'Create Restaurant'}
      >
        <RestaurantForm
          restaurant={activeRestaurant}
          addOptimistic={addOptimisticRestaurant}
          openModal={openModal}
          closeModal={closeModal}
        />
      </Modal>
      <div className='absolute right-0 top-0 '>
        <Button
          onClick={() => openModal()}
          variant={'outline'}
        >
          +
        </Button>
      </div>
      {optimisticRestaurants.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticRestaurants.map((restaurant) => (
            <Restaurant
              restaurant={restaurant}
              key={restaurant.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const Restaurant = ({ restaurant, openModal }: { restaurant: CompleteRestaurant; openModal: TOpenModal }) => {
  const optimistic = restaurant.id === 'optimistic'
  const deleting = restaurant.id === 'delete'
  const mutating = optimistic || deleting
  const pathname = usePathname()
  const basePath = pathname.includes('restaurants') ? pathname : pathname + '/restaurants/'

  return (
    <li
      className={cn('flex justify-between my-2', mutating ? 'opacity-30 animate-pulse' : '', deleting ? 'text-destructive' : '')}
    >
      <div className='w-full flex flex-row gap-6 '>
        {restaurant.logo && (
          <Image
            src={restaurant.logo}
            alt=''
            height={128}
            width={128}
          />
        )}
        <div>{restaurant.name}</div>
      </div>
      <Button
        variant={'link'}
        asChild
      >
        <Link href={basePath + '/' + restaurant.id}>Edit</Link>
      </Button>
    </li>
  )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-secondary-foreground'>No restaurants</h3>
      <p className='mt-1 text-sm text-muted-foreground'>Get started by creating a new restaurant.</p>
      <div className='mt-6'>
        <Button onClick={() => openModal()}>
          <PlusIcon className='h-4' /> New Restaurants{' '}
        </Button>
      </div>
    </div>
  )
}
