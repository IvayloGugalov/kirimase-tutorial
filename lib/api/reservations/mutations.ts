import { db } from "@/lib/db/index";
import { 
  ReservationId, 
  NewReservationParams,
  UpdateReservationParams, 
  updateReservationSchema,
  insertReservationSchema, 
  reservationIdSchema 
} from "@/lib/db/schema/reservations";
import { getUserAuth } from "@/lib/auth/utils";

export const createReservation = async (reservation: NewReservationParams) => {
  const { session } = await getUserAuth();
  const newReservation = insertReservationSchema.parse({ ...reservation, userId: session?.user.id! });
  try {
    const r = await db.reservation.create({ data: newReservation });
    return { reservation: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateReservation = async (id: ReservationId, reservation: UpdateReservationParams) => {
  const { session } = await getUserAuth();
  const { id: reservationId } = reservationIdSchema.parse({ id });
  const newReservation = updateReservationSchema.parse({ ...reservation, userId: session?.user.id! });
  try {
    const r = await db.reservation.update({ where: { id: reservationId, userId: session?.user.id! }, data: newReservation})
    return { reservation: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteReservation = async (id: ReservationId) => {
  const { session } = await getUserAuth();
  const { id: reservationId } = reservationIdSchema.parse({ id });
  try {
    const r = await db.reservation.delete({ where: { id: reservationId, userId: session?.user.id! }})
    return { reservation: r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

