import { Router } from "express";
import Listing from "../models/Listing.js";

const router = Router();

// Create
router.post("/", async (req, res) => {
  try {
    const doc = await Listing.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    console.error("POST /api/listings error:", e);
    res.status(400).json({ error: e.message });
  }
});

// Read all
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const items = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    console.error("GET /api/listings error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Read one
router.get("/:id", async (req, res) => {
  try {
    const item = await Listing.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const item = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const ok = await Listing.findByIdAndDelete(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
