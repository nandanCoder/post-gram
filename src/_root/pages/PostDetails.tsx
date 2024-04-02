import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutations";
import { formatDateString } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // react query
  const { data: post, isPending } = useGetPostById(id || "");
  const { mutateAsync: deletePost, isPending: isDeleteingPost } =
    useDeletePost();

  const { user } = useUserContext();

  const handleDeletePost = () => {
    //console.log(post);
    deletePost({
      postId: post?.$id || "",
      imageId: post?.imageId,
    });
    toast({
      title: "Post deleted successfully",
    });
    navigate(-1);
  };
  // console.log(user.id == post?.creator);
  // console.log(post?.creator.$id);
  // console.log(user.id);

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full"></div>
            <Link
              className="flex items-center gap-3"
              to={`profile/${post?.creator.$id}`}>
              <img
                src={
                  post?.creator?.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
              />

              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {post?.creator.name}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="sutle-semibold lg:small-reguler">
                    {formatDateString(post?.$createdAt || "")}
                  </p>
                  -
                  <p className="sutle-semibold lg:small-reguler">
                    {post?.location}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex-center gap-4">
              {user.id === post?.creator.$id ? (
                <>
                  <Link to={`/update-post/${post?.$id}`}>
                    <img
                      src="/assets/icons/edit.svg"
                      width={24}
                      height={24}
                      alt="edit"
                    />
                  </Link>
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className="ghost_details-delete_btn">
                    {isDeleteingPost ? (
                      <Loader2 />
                    ) : (
                      <img
                        src="/assets/icons/delete.svg"
                        height={24}
                        width={24}
                        alt="delete"
                      />
                    )}
                  </Button>
                </>
              ) : null}
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular ">
              <p className="">{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
