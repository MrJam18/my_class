import {compareAsc} from "date-fns";
import {WeekParserService} from "./WeekParserService";

export class EndDateWeekParserService extends WeekParserService {
    private readonly endDate: Date;

    constructor(startDate: string, weekDays: number[], endDate: string) {
        super(startDate, weekDays);
        this.endDate = new Date(endDate);
    }

    isLoopMustBreakOff(): boolean {
        return compareAsc(this.currentDate, this.endDate) === 1;
    }
}


