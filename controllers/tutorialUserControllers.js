import {
  createUser,
  getUserById,
  updateUser,
  getAllUsers,
    deleteUser,
} from "../models/tutorialUser.js";

const tutorialUserControllers = {
  addUser: async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await getUserById(req.params.id);
      if (user) res.json(user);
      else res.status(404).json({ err: "User not found" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  updateUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const updatedUser = await updateUser(userId, req.body);
      if (updatedUser) res.json(updatedUser);
      else res.status(404).json({ err: "User not found" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await deleteUser(userId);
      if (deletedUser) res.json(deletedUser);
      else res.status(404).json({ err: "User not found" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
};
export default tutorialUserControllers;
