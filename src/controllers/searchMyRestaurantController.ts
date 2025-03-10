import { Request, Response } from "express";
import Restaurant from "../models/restaurants";

// get single restaurant by using id
const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// get all restaurants by using city name.
const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    const query: any = {};

    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }
    if (selectedCuisines) {
      const cousinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cousinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    console.log(query);
    // pagination
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // sort options = "last updated"
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);
    const resTotal = restaurants.reduce(
      (acc, val) => acc + val.deliveryPrice,
      0
    );

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
    console.log(resTotal);
    console.log(response);

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    // return res.status(500).json({ message: "Something went wrong." });
    res.sendStatus(500);
  }
};

export default {
  searchRestaurant,
  getRestaurant,
};
