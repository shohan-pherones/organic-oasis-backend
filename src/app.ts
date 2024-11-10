import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import AppError from "./app/errors/app.error";
import router from "./app/routes";

const app = express();

const configureMiddleware = () => {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("short"));
};

const initializeRoutes = () => {
  app.use("/api/v1", router);
  app.get("/api/v1/health", (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ message: "Server is running healthy!" });
  });
  app.use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
  });
};

const handleErrors = () => {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  });

  process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (error: Error) => {
    console.error("Uncaught Exception:", error.message);
  });
};

export const createApp = () => {
  configureMiddleware();
  initializeRoutes();
  handleErrors();
  return app;
};
