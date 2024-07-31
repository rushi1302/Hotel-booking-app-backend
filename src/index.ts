import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { v2 as cloudinary } from "cloudinary";
import userRestaurantRoute from "./routes/userRestaurantRoute";
import restaurantRoute from "./routes/searchRestaurantRoute";
import OrderRoute from "./routes/OrderRoute";

// creating instance of express server.
const app = express();

mongoose.connect(process.env.MONGO_URL as string).then(() => {
  console.log("Connected with Database.");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//we have recieved a raw type data from stripe and we dont want to convert it into json so thats why we are adding this middleware.
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cors());

app.use("/api/my/user", userRoute);
app.use("/api/my/restaurant", userRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", OrderRoute);

app.listen(3000, () => {
  console.log(`Server Started on localhost:3000`);
});
