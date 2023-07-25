import knex from "knex";
import {config} from "dotenv";
config();
const env = process.env;
const db = knex({
    client: 'postgresql',
    connection: {
        host : env.DB_HOST,
        port : Number(env.DB_PORT),
        user : env.DB_USER,
        password : env.DB_PASSWORD,
        database : env.TEST === "TRUE" ? env.TEST_DB : env.DB_NAME
    }
});


export default db;