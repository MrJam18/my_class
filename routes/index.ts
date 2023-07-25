import {Router} from "express";
import LessonsController from "../controllers/LessonsController";

const router = Router();

router.get('/', LessonsController.getList);
router.post('/lessons', LessonsController.createLesson);
router.get('/get-one', LessonsController.getOne);
router.get('*', function(req, res){
    res.status(404).json({error: 'not found'});
});

export default router;