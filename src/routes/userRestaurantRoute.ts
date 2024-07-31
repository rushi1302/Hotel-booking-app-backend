import express from "express";
import multer from "multer";
import myRestaurantController from "../controllers/myRestaurantControllers";
import exp from "constants";
import { upload } from "../middleware/multer";
import { validateMyRestaurantRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/auth";
const router = express.Router();

// to fetch orders
router.get(
  "/order",
  jwtCheck,
  jwtParse,
  myRestaurantController.getMyRestaurantOrders
);
router.get("/", jwtCheck, jwtParse, myRestaurantController.getMyRestaurant);

router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  myRestaurantController.createMyRestaurant
);

router.put(
  "/",
  upload.single("ImageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  myRestaurantController.updateMyRestaurant
);

// to update order status
router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  myRestaurantController.updateMyRestaurantOrder
);

export default router;
