import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/reservations/useOptimisticReservations";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Reservation, insertReservationParams } from "@/lib/db/schema/reservations";
import {
  createReservationAction,
  deleteReservationAction,
  updateReservationAction,
} from "@/lib/actions/reservations";
import { type Restaurant, type RestaurantId } from "@/lib/db/schema/restaurants";

const ReservationForm = ({
  restaurants,
  restaurantId,
  reservation,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  reservation?: Reservation | null;
  restaurants: Restaurant[];
  restaurantId?: RestaurantId
  openModal?: (reservation?: Reservation) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Reservation>(insertReservationParams);
  const editing = !!reservation?.id;
    const [reservationDate, setReservationDate] = useState<Date | undefined>(
    reservation?.reservationDate,
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("reservations");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Reservation },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Reservation ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const reservationParsed = await insertReservationParams.safeParseAsync({ restaurantId, ...payload });
    if (!reservationParsed.success) {
      setErrors(reservationParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = reservationParsed.data;
    const pendingReservation: Reservation = {
      updatedAt: reservation?.updatedAt ?? new Date(),
      createdAt: reservation?.createdAt ?? new Date(),
      id: reservation?.id ?? "",
      userId: reservation?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingReservation,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateReservationAction({ ...values, id: reservation.id })
          : await createReservationAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingReservation
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={reservation?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.occupants ? "text-destructive" : "",
          )}
        >
          Occupants
        </Label>
        <Input
          type="text"
          name="occupants"
          className={cn(errors?.occupants ? "ring ring-destructive" : "")}
          defaultValue={reservation?.occupants ?? ""}
        />
        {errors?.occupants ? (
          <p className="text-xs text-destructive mt-2">{errors.occupants[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.description ? "text-destructive" : "",
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={reservation?.description ?? ""}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">{errors.description[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
<div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.reservationDate ? "text-destructive" : "",
          )}
        >
          Reservation Date
        </Label>
        <br />
        <Popover>
          <Input
            name="reservationDate"
            onChange={() => {}}
            readOnly
            value={reservationDate?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !reservation?.reservationDate && "text-muted-foreground",
              )}
            >
              {reservationDate ? (
                <span>{format(reservationDate, "PPP")}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setReservationDate(e)}
              selected={reservationDate}
              disabled={(date) =>
                date < new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.reservationDate ? (
          <p className="text-xs text-destructive mt-2">{errors.reservationDate[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.status ? "text-destructive" : "",
          )}
        >
          Status
        </Label>
        <Input
          type="text"
          name="status"
          className={cn(errors?.status ? "ring ring-destructive" : "")}
          defaultValue={reservation?.status ?? ""}
        />
        {errors?.status ? (
          <p className="text-xs text-destructive mt-2">{errors.status[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {restaurantId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.restaurantId ? "text-destructive" : "",
          )}
        >
          Restaurant
        </Label>
        <Select defaultValue={reservation?.restaurantId} name="restaurantId">
          <SelectTrigger
            className={cn(errors?.restaurantId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a restaurant" />
          </SelectTrigger>
          <SelectContent>
          {restaurants?.map((restaurant) => (
            <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
              {restaurant.name}{/* TODO: Replace with a field from the restaurant model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.restaurantId ? (
          <p className="text-xs text-destructive mt-2">{errors.restaurantId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: reservation });
              const error = await deleteReservationAction(reservation.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: reservation,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default ReservationForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
