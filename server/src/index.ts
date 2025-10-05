import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
await connectDB();
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-authentication-system-lovat.vercel.app",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

//API end points
app.get("/", (_req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () =>
  console.log(`Server runnning at http://localhost:${PORT}`)
);
