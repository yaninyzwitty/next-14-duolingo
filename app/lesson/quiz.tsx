"use client";
import {challengeOptions, challenges, userSubscription} from "@/db/schema";
import React, {useState, useTransition} from "react";
import Header from "./header";
import QuestionBubble from "./question-bubble";
import Challenge from "./challenge";
import Footer from "./footer";
import {upsertChallengeProgress} from "@/actions/challenge-progress";
import {toast} from "sonner";
import {reduceHearts} from "@/actions/user-progress";
import Confetti from "react-confetti";
import {useAudio, useWindowSize, useMount} from "react-use";
import Image from "next/image";
import ResultCard from "./result-card";
import {useRouter} from "next/navigation";
import {useHeartsModal} from "@/store/use-hearts-modal";
import {usePracticeModal} from "@/store/use-practice-modal";

type Props = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferInsert & {
        isActive: boolean;
      })
    | null;
};

function Quiz({
  initialHearts,
  initialLessonChallenges,
  initialLessonId,
  initialPercentage,
  userSubscription,
}: Props) {
  const [correctAudio, _c, correctControls] = useAudio({src: "/correct.wav"});
  const [incorrectAudio, _i, incorrectAudioControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });

  const {open: openHearts} = useHeartsModal();
  const {open: openPracticeModal} = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });
  const {width, height} = useWindowSize();
  const router = useRouter();

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges] = useState(initialLessonChallenges);
  const [lessonId] = useState(initialLessonId);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  const [activeIndex, setActiveIndex] = useState(() => {
    const unCompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];
  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onContinue = () => {
    if (!selectedOption) return;
    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }
    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((res) => {
            if (res?.error === "hearts") {
              openHearts();
              return;
            }

            setStatus("correct");
            correctControls.play();
            setPercentage((prev) => (prev + 100) / challenges.length);

            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong!"));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((res) => {
            if (res?.error === "hearts") {
              console.error("Missing hearts");
              return;
            }
            setStatus("wrong");
            incorrectAudioControls.play();
            if (!res?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong! Please try again"));
      });
    }
  };

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={700}
          width={width}
          height={height}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src={"/finish.svg"}
            alt="finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src={"/finish.svg"}
            alt="finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job
            <br />
            You&apos;ve completed the lesson
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonID={lessonId}
          status={"completed"}
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge?.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge?.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubcription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="w-full flex items-center justify-center min-h-screen">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge?.type === "ASSIST" && (
                <QuestionBubble question={challenge?.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={false || pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
}

export default Quiz;
