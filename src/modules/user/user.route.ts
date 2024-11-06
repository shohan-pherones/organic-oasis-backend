import express, { Router } from "express";
import { UserControllers } from "./user.controller";
import { validate } from "../../middlewares/validation.middleware";
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

export default router;
