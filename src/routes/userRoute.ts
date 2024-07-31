import express, { Response, Request } from "express";
import MyUserControllers from "../controllers/MyUserControllers";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, MyUserControllers.getCurrentUser);
router.post("/", jwtCheck, MyUserControllers.createCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserControllers.updateCurrentUser
);
export default router;
