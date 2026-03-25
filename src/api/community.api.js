export async function fetchCommunityPosts() {
   const res = await fetch("/api/community/posts");
   if (!res.ok) {
      throw new Error("Failed to fetch posts");
   }
   return res.json(); //frontend is called data
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

export async function createCommunityPost({ title, content, label, images = [], video = null }) {
  // upload media in Cloudinary
  const mediaUrls = [];

  for (let i = 0; i < images.length; i++) {
    const result = await uploadToCloudinary(images[i]);
    mediaUrls.push(result);
    //mediaurls is {type:"", url:""}
  }

  if (video) {
    const result = await uploadToCloudinary(video);
    mediaUrls.push(result);
  }

  // type and url, POST to backend
  const res = await fetch("/api/community/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, label, media: mediaUrls }),
  });

  if (!res.ok) throw new Error("Failed to post");
  return res.json();
}