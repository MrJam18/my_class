import {addDays} from "date-fns";
import {WeekParserService} from "./WeekParserService";
import startOfWeek from 'date-fns/startOfWeek';
import differenceInDays from 'date-fns/differenceInDays';
import {getISODate} from "../../utils/getISODate";


export class CountWeekParserService extends WeekParserService
{
    private readonly count: number;
    private counter: number = 0;

    constructor(startDate: string, weekDays: number[], count: number)
    {
        super(startDate, weekDays);
        this.count = count;
    }

    isLoopMustBreakOff(): boolean {
        this.counter++;
        return this.count < this.counter;
    }



}