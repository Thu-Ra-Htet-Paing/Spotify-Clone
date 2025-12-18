import express from "express";
import {
  mustBeLoggedIn,
  requireAdmin,
} from "../middlewares/auth.middleware.js";
import { getStats } from "../controllers/stat.controller.js";

const router = express.Router();

router.get("/", mustBeLoggedIn, requireAdmin, getStats);

export default router;
