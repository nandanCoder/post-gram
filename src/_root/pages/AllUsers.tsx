import Loader from "@/components/shared/Loader";
import SearchResult from "@/components/shared/SearchResult";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetUsers,
  useSearchUsers,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const { toast } = useToast();
  const {
    data: creators,
    isPending: isLoadingCreators,
    isError: isErrorCreator,
    hasNextPage,
    fetchNextPage,
  } = useGetUsers();
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);

  const { ref, inView } = useInView();
  console.log("data", creators);
  const { data: searchedUser, isPending: isSearchLoadingCreator } =
    useSearchUsers(debouncedValue);

  console.log(
    "searched user",
    searchedUser,
    "Loading:",
    isSearchLoadingCreator
  );
  if (isErrorCreator) {
    toast({ title: "Something went wrong." });
    return;
  }
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (!creators) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowUser =
    shouldShowSearchResults &&
    creators?.pages.every((creator) => creator?.documents.length === 0);
  console.log("show", shouldShowUser);

  return (
    <div className="common-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full ">Search Users</h2>
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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="explore-search"
          />
        </div>
      </div>

      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoadingCreators && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {shouldShowSearchResults ? (
              searchedUser ? (
                <SearchResult
                  resultType="USER"
                  isSearchFetching={isSearchLoadingCreator}
                  searchedResults={searchedUser}
                />
              ) : (
                <Loader />
              )
            ) : shouldShowUser ? (
              <p className="text-light-4 mt-10 text-center w-full">
                End of Users
              </p>
            ) : (
              creators.pages.map((creator, index) => {
                if (creator) {
                  return (
                    <li
                      key={`page-${index}`}
                      className="flex-1 min-w-[200px] w-full  ">
                      <UserCard users={creator.documents} />
                    </li>
                  );
                } else {
                  return null;
                }
              })
            )}
          </ul>
        )}
      </div>
      {hasNextPage && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AllUsers;
