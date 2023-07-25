"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonsController_1 = __importDefault(require("../controllers/LessonsController"));
const router = (0, express_1.Router)();
router.get('/', LessonsController_1.default.getList);
router.post('/lessons', LessonsController_1.default.createLesson);
router.get('/get-one', LessonsController_1.default.getOne);
router.get('*', function (req, res) {
    res.status(404).json({ error: 'not found' });
});
exports.default = router;
//# sourceMappingURL=index.js.map