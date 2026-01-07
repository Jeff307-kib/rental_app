// routes/post.route.js
import { Router } from "express";

import { createPost } from "../controllers/post.controller.js";

const router = Router();


router.post("/", createPost);

export default router;