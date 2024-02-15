"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/restaurants/useOptimisticRestaurants";
import { type Restaurant } from "@/lib/db/schema/restaurants";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import RestaurantForm from "@/components/restaurants/RestaurantForm";


export default function OptimisticRestaurant({ 
  restaurant,
   
}: { 
  restaurant: Restaurant; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Restaurant) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticRestaurant, setOptimisticRestaurant] = useOptimistic(restaurant);
  const updateRestaurant: TAddOptimistic = (input) =>
    setOptimisticRestaurant({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <RestaurantForm
          restaurant={optimisticRestaurant}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateRestaurant}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticRestaurant.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticRestaurant.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticRestaurant, null, 2)}
      </pre>
    </div>
  );
}
