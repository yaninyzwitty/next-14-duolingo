import {cn} from "@/lib/utils";
import Image from "next/image";
type Props = {
  value: number;
  variant: "points" | "hearts";
};

function ResultCard({value, variant}: Props) {
  const imageSrc = variant == "points" ? "/points.svg" : "/heart.svg";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 w-full",
        variant === "points" && "bg-orange-400 border-orange-400",
        variant === "hearts" && "bg-rose-500 border-rose-500"
      )}
    >
      <div
        className={cn(
          "p-1.5 text-white rounded-xl font-bold text-center uppercase text-xs",
          variant === "hearts" && "bg-rose-500 ",
          variant === "points" && "bg-orange-500"
        )}
      >
        {variant === "hearts" ? "Hearts left" : "Total Xp"}
        <div
          className={cn(
            "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
            variant === "hearts" && "text-rose-500",
            variant === "points" && "text-orange-500"
          )}
        >
          <Image
            src={imageSrc}
            alt="Icon"
            height={30}
            width={30}
            className="mr-1.5"
          />
          {value}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
