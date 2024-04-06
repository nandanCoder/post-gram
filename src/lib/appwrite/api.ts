import { ID, Query } from "appwrite";

import { appwriteConfig, account, databases, avatars, storage } from "./config";
import {
  INewFollower,
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateUser,
} from "@/types";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    //console.log(currentAccount);
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    //console.log(currentUser.documents[0]);
    if (!currentUser) throw Error;
    //console.log(currentUser);
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(imageId: string) {
  if (!imageId) return;
  try {
    await storage.deleteFile(appwriteConfig.storageId, imageId);
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  if (!post) return;
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const createdPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!createdPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return createdPost;
  } catch (error) {
    console.log(error);
  }
}
// upload gile
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(imageId: string) {
  if (!imageId) return;
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      imageId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;
    //console.log("fileUrl: " + fileUrl);
    return fileUrl;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteAppwriteStorageFile(imageId: string) {
  if (!imageId) return;
  try {
    await storage.deleteFile(appwriteConfig.storageId, imageId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
    return false;
  }
}

// get all posts

export async function getRecentPost() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    console.log("I am on the api reqast");
    return { statusCode: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  if (!post) return;
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    deleteAppwriteStorageFile(imageId);
    console.log("I am now hare on remove");
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
// ifinite scroll

export async function getInfinitePosts({ pageParam }: { pageParam: string }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];
  // console.log("this is page param", pageParam);
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    //console.log("Now im am Hare ", searchTerm, ":", posts);
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
}
//  ata use na kora o ami user ar data taka data nita pari
export async function getSavedPosts() {
  try {
    const currentAccount = await getCurrentUser();
    //console.log("Current Account", currentAccount);
    if (!currentAccount) return;
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("user", currentAccount?.$id)]
    );
    //console.log("No on api", posts.documents);
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers({ pageParam }: { pageParam: string }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6)];
  console.log("user page param", pageParam);
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const allUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );
    if (!allUser) throw Error;
    console.log("user,", allUser);
    return allUser;
  } catch (error) {
    console.log(error);
  }
}

export async function searchUser(searchTerm: string) {
  try {
    const searchdUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("name", searchTerm)]
    );
    if (!searchdUser) throw Error;
    return searchdUser.documents;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserByID(userID: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userID
    );

    if (!user) throw Error;
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function follow({ followedBy, follower }: INewFollower) {
  try {
    const newFollow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followerCollectionId,
      ID.unique(),
      {
        followedBy,
        follower,
      }
    );
    if (!newFollow) throw Error;
    console.log("This is new folower", newFollow);
    return newFollow;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllUserFollowers() {
  try {
    const follower = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followerCollectionId
    );
    console.log("this is all followers", follower);
    return follower;
  } catch (error) {
    console.log(error);
  }
}

export async function unFollow(id: string) {
  try {
    const res = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followerCollectionId,
      id
    );
    if (!res) {
      console.log("Sothing get wrong");
    }
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserFolloweingList({ userId }: { userId: string }) {
  const query = [Query.equal("followedBy", userId)];
  try {
    const followeingList = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followerCollectionId,
      query
    );
    if (!followeingList) {
      throw new Error();
    }
    return followeingList;
  } catch (error: any) {
    console.log(
      "Somthing gate wrong in get user following list",
      error.message
    );
  }
}
