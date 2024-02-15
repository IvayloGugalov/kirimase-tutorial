import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from '@/lib/api/restaurants/mutations'
import {
  restaurantIdSchema,
  insertRestaurantParams,
  updateRestaurantParams,
} from '@/lib/db/schema/restaurants'

export async function POST(req: Request) {
  try {
    const validatedData = insertRestaurantParams.parse(await req.json())
    const { restaurant } = await createRestaurant(validatedData)

    revalidatePath('/restaurants') // optional - assumes you will have named route same as entity

    return NextResponse.json(restaurant, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json({ error: err }, { status: 500 })
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const validatedData = updateRestaurantParams.parse(await req.json())
    const validatedParams = restaurantIdSchema.parse({ id })

    const { restaurant } = await updateRestaurant(validatedParams.id, validatedData)

    return NextResponse.json(restaurant, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json(err, { status: 500 })
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const validatedParams = restaurantIdSchema.parse({ id })
    const { restaurant } = await deleteRestaurant(validatedParams.id)

    return NextResponse.json(restaurant, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json(err, { status: 500 })
    }
  }
}
