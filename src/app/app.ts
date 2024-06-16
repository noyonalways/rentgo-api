import "colors";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "../config";
import applicationRoutes from "./routes";

const app: Application = express();

// application middlewares
app.use(morgan(config.NODE_ENV === "development" ? "dev" : "tiny"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// application routes
app.use(applicationRoutes);

export default app;
