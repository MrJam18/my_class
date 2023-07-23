import {Express} from "express";
import {db} from "../app";

class LessonsController
{
    getList = async (req: Express.Request, res, next) =>
    {
        try {
            const lessons = db('lessons');
            return res.json(lessons);
            // console.log(lessons);
        }
        catch (e) {

        }
    }
}

export default new LessonsController()