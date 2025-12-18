import express from "express";
import {
  mustBeLoggedIn,
  requireAdmin,
} from "../middlewares/auth.middleware.js";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
} from "../controllers/song.controller.js";

const router = express.Router();

router.get("/", mustBeLoggedIn, requireAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

export default router;
