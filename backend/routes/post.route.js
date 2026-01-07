// routes/post.route.js
import { Router } from "express";

import { getAllPosts, createPost, updatePost, deletePost } from "../controllers/post.controller.js";

const router = Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;