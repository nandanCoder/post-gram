import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";
import UserCard from "./UserCard";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedResults: Models.Document[];
  resultType: string;
};
const SearchResult = ({
  isSearchFetching,
  searchedResults,
  resultType,
}: SearchResultsProps) => {
  //console.log("post result final", searchedPosts);
  if (isSearchFetching) return <Loader />;

  if (searchedResults && searchedResults.length > 0) {
    if (resultType === "POST") return <GridPostList posts={searchedResults} />;
    return <UserCard users={searchedResults} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResult;
