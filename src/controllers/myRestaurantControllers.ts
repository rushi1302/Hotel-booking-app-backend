import { Request, Response } from "express";
import Restaurant from "../models/restaurants";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import uploadImage from "../lib/cloudinary";
import multer from "multer";
import Order from "../models/order";

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to get restaurant" });
  }
};

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res.status(409).json({ message: "User restaurant already exist" });
    }
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdate = new Date();
    await restaurant.save();
    return res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant doesnt exist" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdate = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }
    await restaurant?.save();
    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// to get orders from restaurant.
// 1. find the restaurant by using userID
// 2. find the specific order by using restaurantId
//3. return the order.

const getMyRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restauarant Not Found." });
    }
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// to update the restaurant order.
//1. get orderId from params.
//2. find the order.

const updateMyRestaurantOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json("Order not found");
    }
    const restaurant = await Restaurant.findById(order.restaurant);
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).json({ message: "Unathorized Request" });
    }
    order.status = status;
    await order.save();
    return res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateMyRestaurantOrder,
};
