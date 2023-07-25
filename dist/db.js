"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const env = process.env;
const db = (0, knex_1.default)({
    client: 'postgresql',
    connection: {
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.TEST === "TRUE" ? env.TEST_DB : env.DB_NAME
    }
});
exports.default = db;
//# sourceMappingURL=db.js.map