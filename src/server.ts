import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import morgan from "morgan";
import connectDB from "./config/db";
import config from "./config/index";
import AppError from "./errors/app.error";
import router from "./routes";

class Server {
  private app: Application;
  private PORT: number | string;

  constructor() {
    this.app = express();
    this.PORT = config.port as string;
    this.connectDatabase();
    this.configureMiddleware();
    this.initializeRoutes();
    this.handleErrors();
  }

  private connectDatabase() {
    connectDB();
  }

  private configureMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(morgan("short"));
  }

  private initializeRoutes() {
    this.app.use("/api/v1", router);
    this.app.get("/api/v1/health", (req: Request, res: Response) => {
      res
        .status(StatusCodes.OK)
        .json({ message: "Server is running healthy!" });
    });
    this.app.use((req: Request, res: Response) => {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Route not found" });
    });
  }

  private handleErrors() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);

        if (err instanceof AppError) {
          res.status(err.statusCode).json({ message: err.message });
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
        }
      }
    );

    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    process.on("uncaughtException", (error: Error) => {
      console.error("Uncaught Exception:", error.message);
    });
  }

  public start() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on http://localhost:${this.PORT}`);
    });
  }
}

const server = new Server();
server.start();
