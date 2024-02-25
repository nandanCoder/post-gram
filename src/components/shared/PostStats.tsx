import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSeved] = useState<boolean>(false);

  // rect query
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingPost } =
    useDeleteSavedPost();

  // not context api
  const { data: currentUser } = useGetCurrentUser();

  // call the user document and check saved list to find a post alredy hare or not
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );
  //console.log(savedPostRecord);
  useEffect(() => {
    setIsSeved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation(); //stop any other place
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      // jodi like kora taka to remove korbo sai id ta na hola add
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    // set on database
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation(); //stop any other place
    // const savedPostRecord = currentUser?.save.find(
    //   //
    //   (record: Models.Document) => record.id === post?.$id
    // );
    if (isSaved) {
      setIsSeved(false);
      // console.log(post?.$id);
      deleteSavedPost(savedPostRecord.$id);
      toast({ title: "Post Unsaved Successfully" });
      return;
    }

    savePost({ userId: userId, postId: post?.$id || "" });

    toast({ title: "Post Saved Successfully" });
    setIsSeved(true);
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          height={20}
          width={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 ">
        {isSavingPost || isDeletingPost ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            height={20}
            width={20}
            onClick={(e) => handleSavePost(e)}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
