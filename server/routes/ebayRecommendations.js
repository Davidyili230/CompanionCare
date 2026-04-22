import express from "express";
import { getEbayRecommendations } from "../services/ebayRecommendationService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const species = req.query.species === "Cat" ? "Cat" : "Dog";
    const data = await getEbayRecommendations(species);
    res.json(data);
  } catch (error) {
    console.error("eBay recommendations error:", error);
    res.status(500).json({
      message: "Failed to fetch eBay recommendations.",
      error: error.message,
    });
  }
});

export default router;