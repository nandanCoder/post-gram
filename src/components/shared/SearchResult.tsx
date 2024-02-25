import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
};
const SearchResult = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultsProps) => {
  //console.log("post result final", searchedPosts);
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResult;
