import {Router} from "express";
import LessonsController from "../controllers/LessonsController";

const router = Router();

router.get('/', LessonsController.getList);
router.get('ds', function (req, res, next) {

})

export default router;