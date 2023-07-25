import {ShowableError} from "./errors/ShowableError";
import router from "./routes/index";
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
const app = express();
export const env = process.env;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: env.SITE_URL
}));

app.use('/api', router);
app.use((err, req, res, next) => {
    console.dir(err);
    console.log(err.message);
    if(err instanceof ShowableError) {
        return res.status(400).json({error: err.message});
    }
    else {
        return res.status(500).json({error: 'Internal server error'});
    }
});



export default app;