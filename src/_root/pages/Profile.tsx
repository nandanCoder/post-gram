import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import {
  useFollowUser,
  useGetUserById,
  useUnfollowUser,
} from "@/lib/react-query/queriesAndMutations";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import LikedPosts from "./LikedPosts";
import { useEffect, useState } from "react";
interface StabBlockProps {
  value: string | number | any;
  label: string;
}
const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);
const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const { data: currentUser, isLoading: isLoadingCurrentUser } = useGetUserById(
    id || ""
  );
  const { mutate: followUser, isPending: isLoadingFollow } = useFollowUser();
  //console.log("Current user ", currentUser);
  //const { data: userFollowers } = useUserFollowers();
  const { mutate: unfollowUser, isPending: isLoadingUnfollow } =
    useUnfollowUser();
  //! follower count ok
  // const followUserRecord = userFollowers?.documents.find(
  //   (record: Models.Document) =>
  //     record.followedBy === user.id && record.follower.$id === id
  // );
  // const followeing = userFollowers?.documents.filter(
  //   (item) => item.followedBy === id
  // );
  const followUserRecord = currentUser?.follower.find(
    (item: any) => item.followedBy.$id === user.id
  );
  //console.log("c", followUserRecord);

  //console.log("Curent user", currentUser);
  //const [userFolloweing, setUserFollowing] = useState<string[]>(followeing);
  //console.log("followeing", followeing);

  // const followers = userFollowers?.documents.filter(
  //   (item) => item.follower.$id === id
  // );

  useEffect(() => {
    setIsFollow(!!followUserRecord);
  }, [followUserRecord]);

  const handaleFollowUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollow) {
      unfollowUser(followUserRecord?.$id || "");
      setIsFollow(false);
      return;
    }
    followUser({ follower: id || "", followedBy: user.id });
  };

  if (!currentUser || isLoadingCurrentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <Link
                className="cursor-pointer"
                to={`/followers/${currentUser.$id}`}>
                <StatBlock
                  value={currentUser.follower?.length}
                  label="Followers"
                />
              </Link>
              <Link to={`/followeing/${currentUser.$id}`}>
                <StatBlock
                  value={currentUser.followeing?.length}
                  label="Following"
                />
              </Link>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button
                onClick={handaleFollowUser}
                type="button"
                variant={isFollow ? "outline" : "default"}
                className={
                  isFollow ? "shad-button_ghost" : "shad-button_primary px-8"
                }>
                {isLoadingFollow ||
                isLoadingUnfollow ||
                isLoadingCurrentUser ? (
                  <Loader />
                ) : isFollow ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {/* {currentUser.posts.length === 0 && "No post sheard this user"} */}
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
