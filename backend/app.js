import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import globalErrorHandler from './middlewares/error.middleware.js';
const app = express();

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(express.json()) //to get postman body data
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(globalErrorHandler);

export default app;
