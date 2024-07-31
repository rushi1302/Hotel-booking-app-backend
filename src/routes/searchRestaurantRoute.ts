import express from "express";
import { param } from "express-validator";
import searchMyRestaurantController from "../controllers/searchMyRestaurantController";

const router = express.Router();

router.get(
  "/:restaurantId",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city parameter must be a valid string."),
  searchMyRestaurantController.getRestaurant
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("city parameter must be a valid string."),
  searchMyRestaurantController.searchRestaurant
);

export default router;
