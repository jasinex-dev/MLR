import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import listingsRouter from "./routes/listings.js";
import reviewsRouter from "./routes/reviews.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || "http://localhost:4000";

app.use(cors({ origin: ORIGIN, credentials: false }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.json({ ok: true, service: "Moon Lounge Resort API" }));
app.get("/api", (_req, res) => res.json({ status: "Moon Lounge Resort API" }));

app.use("/api/listings", listingsRouter);
app.use("/api/reviews", reviewsRouter);

// Boot
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
