"use client";
import {POINTS_TO_REFIL} from "@/lib/constants";
import {refilHearts} from "@/actions/user-progress";
import {createStripeUrl} from "@/actions/user-subscription";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import React, {useTransition} from "react";
import {toast} from "sonner";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

function Items({hasActiveSubscription, hearts, points}: Props) {
  const [pending, startTransition] = useTransition();

  const onRefilHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFIL) return;

    startTransition(() => {
      refilHearts().catch(() => toast.error("Something went wrong!"));
    });
  };

  const onUpgrade = () => {
    startTransition(() => {
      // create stripe checkout URL
      createStripeUrl()
        .then((res) => {
          if (res.data) {
            window.location.href = res.data;
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <ul className="w-full">
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image src={"/heart.svg"} alt="Heart" width={60} height={60} />
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Refill hearts
          </p>
        </div>
        <Button
          disabled={hearts === 5 || points < POINTS_TO_REFIL || pending}
          onClick={onRefilHearts}
        >
          {hearts === 5 ? (
            "FULL"
          ) : (
            <div className="flex items-center">
              <Image src={"/points.svg"} alt="points" height={20} width={20} />
              <p>50</p>
            </div>
          )}
        </Button>
      </div>
      <div className="flex items-center w-full pt-8 gap-x-4 border-t-2 p-4">
        <Image src={"/unlimited.svg"} alt="Unlimited" width={60} height={60} />
        <div className="flex-1 ">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Unlimited hearts
          </p>
        </div>
        <Button disabled={pending || hasActiveSubscription} onClick={onUpgrade}>
          {hasActiveSubscription ? "ACTIVE" : "UPGRADE"}
        </Button>
      </div>
    </ul>
  );
}

export default Items;
