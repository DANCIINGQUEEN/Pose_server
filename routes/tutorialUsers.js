import express from "express";
import tutorialUserControllers from "../controllers/tutorialUserControllers.js";

const router = express.Router();

router
  .post("/adduser", tutorialUserControllers.addUser)
  .get("/getuser/:id", tutorialUserControllers.getUserById)
  .get("/getallusers", tutorialUserControllers.getAllUsers)
  .put("/updateuser/:id", tutorialUserControllers.updateUser)
  .delete("/deleteuser/:id", tutorialUserControllers.deleteUser);

export default router;
