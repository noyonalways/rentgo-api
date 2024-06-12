import "colors";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import applicationRoutes from "./routes";

const app: Application = express();

// middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// application routes
app.use(applicationRoutes);

export default app;
