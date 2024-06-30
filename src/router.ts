import { Router } from "express";
import { GetArticle } from "./handlers/article";
import handleInputErrors from "./modules/middleware";

const router = Router();

router.get("/article", GetArticle);
router.get("/article/:id", () => {});
router.put("/article/:id", () => {});
router.post("/article", () => {});
router.delete("/article/id", () => {});

export default router;
