import express from "express"
import { POSTS } from "../data/posts.mock.js"

const router = express.Router()

const getCommunityPosts = (req, res) => {
  res.json({ items: POSTS })
}

router.get("/posts", getCommunityPosts)
//when we run something/posts, run getCommunityPosts

router.post("/posts", (req, res) => {
  const{
    userId = "u1",
    username = "Anthony",
    title,
    content = "",
    label = "daily",
    media = [],
  } = req.body || {}

  if(!title) {
    return res.status(400).json({ message: "Title is required"})
  }

  const newPost = {
    id: "p" + Date.now(),
    userId,
    username,
    title,
    content,
    label,
    createdAt: new Date().toISOString(),
    likes: 0,
    media: Array.isArray(media) ? media : [],
  }

  POSTS.unshift(newPost)

  res.status(201).json({ item: newPost})
})

export default router