import express, { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";
import { UserValidations } from "./user.validation";

const router: Router = express.Router();

router.post(
  "/register",
  validate(UserValidations.registerSchema),
  UserControllers.register
);
router.post(
  "/login",
  validate(UserValidations.loginSchema),
  UserControllers.login
);
router.post(
  "/refresh-token",
  validate(UserValidations.refreshTokenSchema),
  UserControllers.refreshToken
);
router.get("/all", auth(USER_ROLE.admin), UserControllers.getAllUsers);

export default router;
