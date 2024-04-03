import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
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
  const { ref, inView } = useInView();
  console.log("data", creators);
  // const { data: searchedUser, isPending: isLoadingCreator } =
  //   useSearchUsers(searchValue);

  console.log(creators);
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
  // const shouldShowSearchResults = searchValue !== "";
  // const shouldShowUser =
  //   !shouldShowSearchResults &&
  //   creators?.pages.every((creator) => creator?.documents.length === 0);

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoadingCreators && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators.pages.map((creator, index) => {
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
            })}
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
