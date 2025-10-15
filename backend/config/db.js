import mongoose from "mongoose";


export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not found in .env file");

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Prisijungta prie MongoDB!!!");
  } catch (err) {
    console.error("Klaida jungiantis prie MongoDB:", err.message);
    setTimeout(connectDB, 5000);
  }
}
