import { Application } from "express";
import http from "http";
import { createApp } from "./app";
import connectDB from "./app/config/db";
import env from "./app/config/env";

class Server {
  private app: Application;
  private PORT: number;
  private serverInstance: http.Server | null = null;

  constructor(port: number) {
    this.app = createApp();
    this.PORT = port;
  }

  public static connectDatabaseOnce() {
    connectDB();
  }

  public start() {
    this.serverInstance = this.app.listen(this.PORT, () => {
      console.log(`Server is running on http://localhost:${this.PORT}`);
    });

    process.on("SIGINT", this.stop.bind(this));
    process.on("SIGTERM", this.stop.bind(this));
  }

  public stop() {
    if (this.serverInstance) {
      this.serverInstance.close(() => {
        console.log(`Server on port ${this.PORT} stopped gracefully.`);
        process.exit(0);
      });
    } else {
      console.error("Server instance not found.");
    }
  }
}

Server.connectDatabaseOnce();

const servers: Server[] = [];
const numberOfInstances = 1;

for (let i = 0; i < numberOfInstances; i++) {
  const port = parseInt(env.port as string) + i;
  const server = new Server(port);
  servers.push(server);
  server.start();
}
