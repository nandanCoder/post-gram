import { Models } from "appwrite";
import Loader from "./Loader";
import UserCard from "./UserCard";

type SearchUserResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
};
const SearchUserResult = ({
  isSearchFetching,
  searchedPosts,
}: SearchUserResultProps) => {
  //console.log("post result final", searchedPosts);
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.length > 0) {
    return <UserCard user={searchedPosts} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchUserResult;
