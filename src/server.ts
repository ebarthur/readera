import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { LogOut, Login, createUser } from "./handlers/user";
import { protect } from "./modules/auth";
import router from "./router";
import { allArticles } from "./handlers/public";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req: Request, res: Response) => {
	res.status(200).json({ message: "pong" });
});

app.use("/api/v1", protect, router);

app.get("/", allArticles);

app.post("/auth/signup", createUser);
app.post("/auth/login", Login);
app.get("/auth/logout", LogOut);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(400).json({
		error: "oops, something went wrong!",
	});
});

export default app;
