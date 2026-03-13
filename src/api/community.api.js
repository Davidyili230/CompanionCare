export async function fetchCommunityPosts() {
  const res = await fetch("http://192.168.1.136:8080/api/community/posts")
  if(!res.ok){
    throw new Error("Failed to fetch posts")
  }
  return res.json()   //frontend is called data
}