"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {Button} from "../ui/button";
import {useHeartsModal} from "@/store/use-hearts-modal";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useState} from "react";
function HeartsModal() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const {close, isOpen} = useHeartsModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onClick = () => {
    close();
    router.push("/store");
  };

  if (!isClient) return;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src={"/mascot_bad.svg"}
              alt="mascot_sad"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            You ran out of hearts!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Get pro for unlimited hearts , or purchase them in the store
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="w-full flex flex-col gap-y-4 ">
            <Button
              className="w-full"
              size={"lg"}
              variant={"primary"}
              onClick={onClick}
            >
              Get unlimited Hearts
            </Button>
            <Button
              className="w-full"
              size={"lg"}
              variant={"primaryOutline"}
              onClick={close}
            >
              No thanks
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default HeartsModal;
