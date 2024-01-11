import express from "express";
import memoControllers from "../controllers/memoControllers.js";
const router = express.Router();

router
  .get("/hello", memoControllers.hello)
  .get("/find", memoControllers.getAll)
  .post("/create", memoControllers.create)
  .delete("/delete/:id", memoControllers.delete)
  .put("/update/:id", memoControllers.update);

export default router;