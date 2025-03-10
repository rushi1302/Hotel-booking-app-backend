import { Request, Response } from "express";
import User from "../models/user.model";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById({ _id: req.userId });
    if (!user) {
      res.status(404).json({ message: "User Not Foound" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to get User" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  //1. first we have to check weather the user exist or not.
  // 2.if user doesnt exist then create user if exist return user with message.

  try {
    const { auth0Id } = req.body; 
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).json({ message: "User Already Exist" });
    }
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to create User." });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while updating the user." });
  }
};

export default { getCurrentUser, createCurrentUser, updateCurrentUser };
