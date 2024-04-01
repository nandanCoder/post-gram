import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const AllUsers = () => {
  const { toast } = useToast();
  const {
    data: creators,
    isPending: isLoadingCreators,
    isError: isErrorCreator,
  } = useGetUsers();
  // const { data: searchedUser, isPending: isLoadingCreator } =
  //   useSearchUsers(searchValue);

  console.log(creators);
  if (isErrorCreator) {
    toast({ title: "Something went wrong." });
    return;
  }

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
            {creators.pages[0]?.documents.map((creator: Models.Document) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
