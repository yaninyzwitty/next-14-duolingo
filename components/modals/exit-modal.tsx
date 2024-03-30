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
import {useExitModal} from "@/store/use-exit-modal";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useState} from "react";
function ExitModal() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const {close, isOpen} = useExitModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src={"/mascot_sad.svg"}
              alt="mascot_sad"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Wait don&apos;t go
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You&apos;re about to leave the lesson. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="w-full flex flex-col gap-y-4 ">
            <Button
              className="w-full"
              size={"lg"}
              variant={"primary"}
              onClick={close}
            >
              Keep Learning
            </Button>
            <Button
              className="w-full"
              size={"lg"}
              variant={"dangerOutline"}
              onClick={() => {
                close();
                router.push("/learn");
              }}
            >
              End Session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExitModal;
