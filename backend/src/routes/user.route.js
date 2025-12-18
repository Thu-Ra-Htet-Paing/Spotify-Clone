import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { mustBeLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", mustBeLoggedIn, getAllUsers);
router.get("/messages/:userId", mustBeLoggedIn);

export default router;
