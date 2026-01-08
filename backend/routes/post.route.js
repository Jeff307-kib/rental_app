// routes/post.route.js
import { Router } from "express";

import { getAllPosts, createPost, updatePost, deletePost } from "../controllers/post.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.patch("/:postId", updatePost);
router.delete("/:postId", deletePost);

export default router;