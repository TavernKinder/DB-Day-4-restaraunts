import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;
const dbConnectionString =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mtech";
const app = express();

mongoose.connect(dbConnectionString);
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
const restaurantSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  borough: String,
  capacity: Number,
  address: {
    building: String,
    street: String,
    zipcode: String,
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
