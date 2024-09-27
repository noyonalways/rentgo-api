import "colors";
import cookieParser from "cookie-parser";
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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.0.116:5173",
      "https://rentgo-web.vercel.app",
      "https://rentgo.noyonrahman.xyz",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);
app.use(express.json());
app.use(cookieParser());

// application routes
app.use(applicationRoutes);

export default app;
