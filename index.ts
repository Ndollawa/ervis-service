import express from 'express'
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index";
import aiRouter from "./routes/ai";
import { isVerifiedClient } from './middleware';
import cors from 'cors'

dotenv.config();

const app = express();
const port = process.env.PORT;


app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", isVerifiedClient, indexRouter);
app.use("/ai", isVerifiedClient, aiRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
