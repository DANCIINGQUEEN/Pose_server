import express from "express";
import playListController from "../controllers/playListControllers.js";
const router = express.Router();

router
  .get("/", playListController.holy)
  .get("/getall", playListController.getAll)
  .get("/getone", playListController.getOne)
  .get("/find/:date", playListController.findPlayListByDate)
  .post("/create", playListController.create);


export default router;