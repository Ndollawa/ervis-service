import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index";
import aiRouter from "./routes/ai";
import userRouter from "./routes/user";
import { isVerifiedClient } from "./middleware";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-1.enbfrwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1/`, {
            dbName: 'Ervis',
        }
    )
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) =>
        console.log(`error connecting to the database: \n ${error}`),
    );

app.use("/", isVerifiedClient, indexRouter);
app.use("/ai", isVerifiedClient, aiRouter);
app.use("/user", isVerifiedClient, userRouter);

// app.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });
