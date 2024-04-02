import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResult from "@/components/shared/SearchResult";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  // new pakage to check user alredy last on the page so i featch new data
  const { ref, inView } = useInView();

  const [searchValue, setSearchValue] = useState("");
  // custom hook
  const debouncedValue = useDebounce(searchValue, 500);
  // for optomising
  const { data: searchdPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedValue);
  //  recat query
  //console.log("query search", searchdPosts);

  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  console.log("posts", posts);
  //
  console.log("pagea6a", hasNextPage);
  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPost =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full ">Search Posts</h2>
        <div className="flex gap1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            placeholder="Search"
            type="text"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* explore page */}
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            height={20}
            width={20}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          searchdPosts ? (
            <SearchResult
              isSearchFetching={isSearchFetching}
              searchedPosts={searchdPosts}
            />
          ) : (
            <Loader />
          )
        ) : shouldShowPost ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((item, index) => {
            if (item) {
              return (
                <GridPostList key={`page-${index}`} posts={item.documents} />
              );
            } else {
              return null; // or handle the case where item is undefined
            }
          })
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
