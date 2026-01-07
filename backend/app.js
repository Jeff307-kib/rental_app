import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import globalErrorHandler from './middlewares/error.middleware.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(globalErrorHandler);

export default app;
