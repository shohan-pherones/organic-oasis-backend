import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running healthy!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
