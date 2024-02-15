import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import {
  createReservation,
  deleteReservation,
  updateReservation,
} from '@/lib/api/reservations/mutations'
import {
  reservationIdSchema,
  insertReservationParams,
  updateReservationParams,
} from '@/lib/db/schema/reservations'

export async function POST(req: Request) {
  try {
    const validatedData = insertReservationParams.parse(await req.json())
    const { reservation } = await createReservation(validatedData)

    revalidatePath('/reservations') // optional - assumes you will have named route same as entity

    return NextResponse.json(reservation, { status: 201 })
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

    const validatedData = updateReservationParams.parse(await req.json())
    const validatedParams = reservationIdSchema.parse({ id })

    const { reservation } = await updateReservation(validatedParams.id, validatedData)

    return NextResponse.json(reservation, { status: 200 })
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

    const validatedParams = reservationIdSchema.parse({ id })
    const { reservation } = await deleteReservation(validatedParams.id)

    return NextResponse.json(reservation, { status: 200 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    } else {
      return NextResponse.json(err, { status: 500 })
    }
  }
}
