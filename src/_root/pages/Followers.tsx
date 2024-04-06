import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useGetUserFollowersList } from "@/lib/react-query/queriesAndMutations";
import { Link, useParams } from "react-router-dom";

function Followers() {
  const { userId } = useParams();

  const {
    data: userFollowers,
    isLoading,
    isError,
  } = useGetUserFollowersList(userId || "");
  console.log("DAta", userFollowers);
  if (isError) {
    toast({ title: "Something went wrong." });
    return;
  }
  if (userFollowers?.total === 0) {
    return (
      <h2 className="h3-bold md:h2-bold text-center p-7 w-full">
        No Followeing
      </h2>
    );
  }
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Followeing</h2>
        {isLoading && !userFollowers ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {userFollowers?.documents.map((user) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full  ">
                {/* // user UserCard */}
                <Link
                  to={`/profile/${user.followedBy.$id}`}
                  className="user-card">
                  <img
                    src={
                      user.followedBy.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="rounded-full w-14 h-14"
                  />

                  <div className="flex-center flex-col gap-1">
                    <p className="base-medium text-light-1 text-center line-clamp-1">
                      {user.followedBy.name}
                    </p>
                    <p className="small-regular text-light-3 text-center line-clamp-1">
                      @{user.followedBy.username}
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

export default Followers;
