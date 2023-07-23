import router from "./routes/index";
import express from "express";
import cookieParser from "cookie-parser";
import {config} from "dotenv";
import cors from 'cors';
import knex from 'knex';
config();
const app = express();
export const env = process.env;

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'localhost:8000'
}));
// app.use  (fileUpload({}));
app.use('/api', router);// router must be almost last!
app.use(onError);
export const db = knex({
    client: 'postgresql',
    connection: {
        host : env.DB_HOST,
        port : Number(env.DB_PORT),
        user : env.DB_USER,
        password : env.DB_PASSWORD,
        database : env.DB_NAME
    }
});
const start = async () => {
    try {
        // await sequelize.authenticate();
        // await sequelize.sync({alter: true});
        // await fixture();
        app.listen(PORT, () => console.log('server started on port ' + PORT));
    }
    catch(e) {
        console.dir(e);
    }
}
function onError(req, res) {
    res.status(404);
    res.json({ error: 'Not found' });
}
start();
