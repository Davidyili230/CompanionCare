import { db, auth } from "../firebase";
import {
   collection,
   addDoc,
   getDoc,
   getDocs,
   serverTimestamp,
   query,
   orderBy,
   doc,
   updateDoc,
   increment,
   setDoc,
   deleteDoc,
} from "firebase/firestore";

export async function fetchCommunityPosts() {
   const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
   const snapshot = await getDocs(q);
   return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
   }));
}

export async function fetchMyPosts() {
   const user = auth.currentUser;
   if (!user) return [];

   const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
   const snapshot = await getDocs(q);
   return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((post) => post.authorId === user.uid);
}

//for Cloudinary
async function uploadToCloudinary(file) {
   const formData = new FormData();
   formData.append("file", file);
   formData.append("upload_preset", "CompanionCare");
   //upload_preset is i setup in cloudinary, is called unsigned upload

   const resourceType = file.type.startsWith("video/") ? "video" : "image";

   const res = await fetch(
      `https://api.cloudinary.com/v1_1/dap1qzjmi/${resourceType}/upload`,
      //dap1qzjmi is the name in cloudnary
      { method: "POST", body: formData },
   );

   if (!res.ok) throw new Error("failed to upload the media");
   const data = await res.json();
   return { type: resourceType, url: data.secure_url };
}

export async function createCommunityPost({
   title,
   content,
   label,
   images = [],
   video = null,
}) {
   // upload media in Cloudinary
   const user = auth.currentUser;
   if (!user) throw new Error("please login first");

   const userSnap = await getDoc(doc(db, "users", user.uid));
   const username = userSnap.exists()
      ? userSnap.data().username
      : user.displayName || "Anonymous";

   const imageUrls = [];

   for (let i = 0; i < images.length; i++) {
      const result = await uploadToCloudinary(images[i]);
      imageUrls.push(result.url);
   }
   let videoUrl = null;
   if (video) {
      const result = await uploadToCloudinary(video);
      videoUrl = result.url;
   }

   // type and url, POST to backend
   const postData = {
      title,
      content,
      label: label || null,
      images: imageUrls,
      video: videoUrl,
      authorId: user.uid,
      username,
      authorAvatar: user.photoURL || null,
      likeCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
   };
   const docRef = await addDoc(collection(db, "posts"), postData);
   return { id: docRef.id, ...postData };
}

export async function fetchComments(postId) {
   const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc"),
   );
   const snapshot = await getDocs(q);
   return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
   }));
}

export async function addComment(postId, content) {
   const user = auth.currentUser;
   if (!user) throw new Error("please login first");

   // 把评论写入 posts/{postId}/comments 子集合
   const userSnap = await getDoc(doc(db, "users", user.uid));

   const username = userSnap.exists()
      ? userSnap.data().username
      : user.username || "Anonymous";
   const commentData = {
      authorId: user.uid,
      username: username || "Anonymous",
      authorAvatar: user.photoURL || null,
      content,
      createdAt: serverTimestamp(),
   };
   await addDoc(collection(db, "posts", postId, "comments"), commentData);

   // 同时把帖子的 commentCount + 1
   await updateDoc(doc(db, "posts", postId), {
      commentCount: increment(1),
   });

   return commentData;
}

export async function toggleLike(postId) {
   const user = auth.currentUser;
   if (!user) throw new Error("please login first");

   const postRef = doc(db, "posts", postId);
   const likeRef = doc(db, "posts", postId, "likes", user.uid);

   const likeSnap = await getDoc(likeRef);

   if (likeSnap.exists()) {
      //  取消点赞
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likeCount: increment(-1) });
   } else {
      //  点赞
      await setDoc(likeRef, { createdAt: serverTimestamp() });
      await updateDoc(postRef, { likeCount: increment(1) });
   }

   const updatedPost = await getDoc(postRef);

   return {
      liked: !likeSnap.exists(),
      likeCount: updatedPost.data().likeCount,
   };
}

export async function checkLiked(postId) {
   const user = auth.currentUser;
   if (!user) return false;

   const likeRef = doc(db, "posts", postId, "likes", user.uid);
   const likeSnap = await getDoc(likeRef);
   return likeSnap.exists();
}
export async function fetchCommunityPosts() {
  const res = await fetch("http://192.168.1.136:8080/api/community/posts")
  if(!res.ok){
    throw new Error("Failed to fetch posts")
  }
  return res.json()   //frontend is called data
}

export async function deleteComment(postId, commentId) {
   const user = auth.currentUser;
   if (!user) throw new Error("please login first");

   const commentRef = doc(db, "posts", postId, "comments", commentId);
   const commentSnap = await getDoc(commentRef);

   if (!commentSnap.exists()) throw new Error("comment not found");
   if (commentSnap.data().authorId !== user.uid)
      throw new Error("not your comment");

   await deleteDoc(commentRef);
   await updateDoc(doc(db, "posts", postId), { commentCount: increment(-1) });
}

export async function deletePost(postId) {
   const user = auth.currentUser;
   if (!user) throw new Error("please login first");

   const postRef = doc(db, "posts", postId);
   const postSnap = await getDoc(postRef);

   if (!postSnap.exists()) throw new Error("post not found");
   if (postSnap.data().authorId !== user.uid) throw new Error("not your post");

   // 删 comments 子集合
   const commentsSnap = await getDocs(
      collection(db, "posts", postId, "comments"),
   );
   for (const c of commentsSnap.docs) {
      await deleteDoc(c.ref);
   }

   // 删 likes 子集合
   const likesSnap = await getDocs(collection(db, "posts", postId, "likes"));
   for (const l of likesSnap.docs) {
      await deleteDoc(l.ref);
   }

   // 最后删帖子本身
   await deleteDoc(postRef);
}
