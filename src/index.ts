import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import route from "@/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(helmet());
app.use(cors());

app.use("/api/v1", route);

export default app;
