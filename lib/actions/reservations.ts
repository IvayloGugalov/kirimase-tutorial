"use server";

import { revalidatePath } from "next/cache";
import {
  createReservation,
  deleteReservation,
  updateReservation,
} from "@/lib/api/reservations/mutations";
import {
  ReservationId,
  NewReservationParams,
  UpdateReservationParams,
  reservationIdSchema,
  insertReservationParams,
  updateReservationParams,
} from "@/lib/db/schema/reservations";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateReservations = () => revalidatePath("/reservations");

export const createReservationAction = async (input: NewReservationParams) => {
  try {
    const payload = insertReservationParams.parse(input);
    await createReservation(payload);
    revalidateReservations();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateReservationAction = async (input: UpdateReservationParams) => {
  try {
    const payload = updateReservationParams.parse(input);
    await updateReservation(payload.id, payload);
    revalidateReservations();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteReservationAction = async (input: ReservationId) => {
  try {
    const payload = reservationIdSchema.parse({ id: input });
    await deleteReservation(payload.id);
    revalidateReservations();
  } catch (e) {
    return handleErrors(e);
  }
};