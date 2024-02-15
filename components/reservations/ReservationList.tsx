"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Reservation, CompleteReservation } from "@/lib/db/schema/reservations";
import Modal from "@/components/shared/Modal";
import { type Restaurant, type RestaurantId } from "@/lib/db/schema/restaurants";
import { useOptimisticReservations } from "@/app/(app)/reservations/useOptimisticReservations";
import { Button } from "@/components/ui/button";
import ReservationForm from "./ReservationForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (reservation?: Reservation) => void;

export default function ReservationList({
  reservations,
  restaurants,
  restaurantId 
}: {
  reservations: CompleteReservation[];
  restaurants: Restaurant[];
  restaurantId?: RestaurantId 
}) {
  const { optimisticReservations, addOptimisticReservation } = useOptimisticReservations(
    reservations,
    restaurants 
  );
  const [open, setOpen] = useState(false);
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  const openModal = (reservation?: Reservation) => {
    setOpen(true);
    reservation ? setActiveReservation(reservation) : setActiveReservation(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeReservation ? "Edit Reservation" : "Create Reservation"}
      >
        <ReservationForm
          reservation={activeReservation}
          addOptimistic={addOptimisticReservation}
          openModal={openModal}
          closeModal={closeModal}
          restaurants={restaurants}
        restaurantId={restaurantId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticReservations.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticReservations.map((reservation) => (
            <Reservation
              reservation={reservation}
              key={reservation.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Reservation = ({
  reservation,
  openModal,
}: {
  reservation: CompleteReservation;
  openModal: TOpenModal;
}) => {
  const optimistic = reservation.id === "optimistic";
  const deleting = reservation.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("reservations")
    ? pathname
    : pathname + "/reservations/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{reservation.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + reservation.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No reservations
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new reservation.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Reservations </Button>
      </div>
    </div>
  );
};
