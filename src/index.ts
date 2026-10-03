import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import route from "@/routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("combined"));

app.use(cookieParser());
app.use(helmet());
app.use(cors());

app.use("/api/v1", route);

app.use(errorHandler);

export default app;
