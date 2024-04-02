import { Models } from "appwrite";
import Loader from "./Loader";

type SearchUserResultProps = {
  isSearchFetching: boolean;
  searchedUsers: Models.Document[];
};
const SearchUserResult = ({
  isSearchFetching,
  searchedUsers,
}: SearchUserResultProps) => {
  //console.log("post result final", searchedPosts);
  if (isSearchFetching) return <Loader />;

  if (searchedUsers && searchedUsers.length > 0) {
    return; //<UserCard user={searchedUsers} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchUserResult;
