import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/app.error";
import { createToken, verifyToken } from "../../utils/jwt.util";
import { IUser } from "./user.interface";
import UserModel from "./user.model";

const register = async (userData: IUser) => {
  const existingUser = await UserModel.findOne({ email: userData.email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = new UserModel({
    ...userData,
    password: hashedPassword,
  });

  await user.save();

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User with this email does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  const { userId } = verifyToken(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

const getAllUsers = async (): Promise<IUser[]> => {
  const users = await UserModel.find();

  if (!users) {
    throw new AppError(StatusCodes.NOT_FOUND, "No user found");
  }

  return users;
};

export const UserServices = {
  register,
  login,
  refreshToken,
  getAllUsers,
};
