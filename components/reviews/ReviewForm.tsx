import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/reviews/useOptimisticReviews";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Review, insertReviewParams } from "@/lib/db/schema/reviews";
import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "@/lib/actions/reviews";
import { type Reservation, type ReservationId } from "@/lib/db/schema/reservations";

const ReviewForm = ({
  reservations,
  reservationId,
  review,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  review?: Review | null;
  reservations: Reservation[];
  reservationId?: ReservationId
  openModal?: (review?: Review) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Review>(insertReviewParams);
  const editing = !!review?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("reviews");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Review },
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
      toast.success(`Review ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const reviewParsed = await insertReviewParams.safeParseAsync({ reservationId, ...payload });
    if (!reviewParsed.success) {
      setErrors(reviewParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = reviewParsed.data;
    const pendingReview: Review = {
      updatedAt: review?.updatedAt ?? new Date(),
      createdAt: review?.createdAt ?? new Date(),
      id: review?.id ?? "",
      userId: review?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingReview,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateReviewAction({ ...values, id: review.id })
          : await createReviewAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingReview
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
            errors?.information ? "text-destructive" : "",
          )}
        >
          Information
        </Label>
        <Input
          type="text"
          name="information"
          className={cn(errors?.information ? "ring ring-destructive" : "")}
          defaultValue={review?.information ?? ""}
        />
        {errors?.information ? (
          <p className="text-xs text-destructive mt-2">{errors.information[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.rating ? "text-destructive" : "",
          )}
        >
          Rating
        </Label>
        <Input
          type="text"
          name="rating"
          className={cn(errors?.rating ? "ring ring-destructive" : "")}
          defaultValue={review?.rating ?? ""}
        />
        {errors?.rating ? (
          <p className="text-xs text-destructive mt-2">{errors.rating[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.restaurantId ? "text-destructive" : "",
          )}
        >
          Restaurant Id
        </Label>
        <Input
          type="text"
          name="restaurantId"
          className={cn(errors?.restaurantId ? "ring ring-destructive" : "")}
          defaultValue={review?.restaurantId ?? ""}
        />
        {errors?.restaurantId ? (
          <p className="text-xs text-destructive mt-2">{errors.restaurantId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {reservationId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.reservationId ? "text-destructive" : "",
          )}
        >
          Reservation
        </Label>
        <Select defaultValue={review?.reservationId} name="reservationId">
          <SelectTrigger
            className={cn(errors?.reservationId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a reservation" />
          </SelectTrigger>
          <SelectContent>
          {reservations?.map((reservation) => (
            <SelectItem key={reservation.id} value={reservation.id.toString()}>
              {reservation.name} - {reservation.restaurantId}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.reservationId ? (
          <p className="text-xs text-destructive mt-2">{errors.reservationId[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: review });
              const error = await deleteReviewAction(review.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: review,
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

export default ReviewForm;

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
