import FeedWrapper from "@/components/feed-wrapper";
import Promo from "@/components/promo";
import Quests from "@/components/quests";
import StickyWrapper from "@/components/sticky-wrapper";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import UserProgress from "@/components/user-progress";
import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import Image from "next/image";
import {redirect} from "next/navigation";

async function LeaderboardPage() {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const toptenUsersData = getTopTenUsers();

  const [userProgress, userSubscription, toptenUsers] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    toptenUsersData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");
  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src={"/leaderboard.svg"}
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in the community.
          </p>

          {toptenUsers.map((userProgess, idx) => (
            <div
              key={userProgess.userId}
              className="flex items-center justify-between w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className="font-bold text-lime-700 ml-4">{idx + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage
                  className="object-cover"
                  src={userProgess.userImageSrc}
                />
              </Avatar>
              <p className="font-bold text-neutral-800 flex-1">
                {userProgess.userName}
              </p>
              <p className="text-muted-foreground">{userProgess.points} xp</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
}

export default LeaderboardPage;
