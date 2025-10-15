import { Router } from "express";
import Review from "../models/Review.js";

const router = Router();

// Create review
router.post("/", async (req, res) => {
  try {
    const { listingId, name, rating, comment } = req.body;
    const doc = await Review.create({ listingId, name, rating, comment });
    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read reviews (optionally by listingId)
router.get("/", async (req, res) => {
  try {
    const q = {};
    if (req.query.listingId) q.listingId = req.query.listingId;
    const items = await Review.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update review
router.put("/:id", async (req, res) => {
  try {
    const item = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete review
router.delete("/:id", async (req, res) => {
  try {
    const ok = await Review.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
