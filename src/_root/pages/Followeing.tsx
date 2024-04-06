import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetUserFolloweingList } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";

function Followeing() {
  const { userId } = useParams();
  const { toast } = useToast();
  const {
    data: userFolloweing,
    isPending: isLoading,
    isError,
  } = useGetUserFolloweingList(userId || "");
  console.log(userFolloweing, isLoading);
  if (isError) {
    toast({ title: "Something went wrong." });
    return;
  }
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Followeing</h2>
        {isLoading && !userFolloweing ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {userFolloweing?.documents.map((user) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full  ">
                {/* // user UserCard */}
                <Link
                  to={`/profile/${user.follower.$id}`}
                  className="user-card">
                  <img
                    src={
                      user.follower.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="rounded-full w-14 h-14"
                  />

                  <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-light-1 text-center line-clamp-1">
                      {user.follower.name}
                    </p>
                    <p className="small-regular text-light-3 text-center line-clamp-1">
                      @{user.follower.username}
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    className="shad-button_primary px-5">
                    Profile
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Followeing;
