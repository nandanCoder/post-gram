import Postform from "@/components/form/Postform";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-center w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="Addpost"
            height={36}
            width={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        {/* postform */}

        <Postform action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
