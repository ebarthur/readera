import cors from "cors";
import express from "express";
import morgan from "morgan";
import router from "./router";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
	res.status(200).json({ message: "pong" });
});

app.use("/api/v1", router);

export default app;
