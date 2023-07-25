"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const ShowableError_1 = require("./errors/ShowableError");
const index_1 = __importDefault(require("./routes/index"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.env = process.env;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: exports.env.SITE_URL
}));
app.use('/api', index_1.default);
app.use((err, req, res, next) => {
    console.dir(err);
    console.log(err.message);
    if (err instanceof ShowableError_1.ShowableError) {
        return res.status(400).json({ error: err.message });
    }
    else {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map