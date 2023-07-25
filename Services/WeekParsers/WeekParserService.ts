import {addDays, addYears, compareAsc} from "date-fns";
import differenceInDays from "date-fns/differenceInDays";
import startOfWeek from "date-fns/startOfWeek";
import {ShowableError} from "../../errors/ShowableError";
import {getISODate} from "../../utils/getISODate";

export abstract class WeekParserService {
    protected startDate: Date;
    protected currentIndex: number;
    protected currentDayOfWeek: number;
    protected weekDays: number[];
    protected currentDate: Date;
    protected dates: string[];

    protected constructor(startDate: string, weekDays: number[]) {
        this.startDate = new Date(startDate);
        this.weekDays = weekDays;
        this.currentDate = this.startDate;
        this.dates = [];
        this.currentIndex = 0;
    }

    getDates(): string[]
    {
        const weekStart = startOfWeek(this.startDate);
        this.currentDayOfWeek = differenceInDays(this.startDate, weekStart);
        if(this.currentDayOfWeek < this.weekDays[0]) {
            this.dateLoop();
        }
        else if(this.currentDayOfWeek > this.weekDays.at(-1)) {
            this.toStartOfWeek();
            this.dateLoop();
        }
        else {
            this.weekDays.find( (weekDay, index) => {
                if (this.currentDayOfWeek >= weekDay && this.currentDayOfWeek <= this.weekDays[index + 1]) {
                    this.currentIndex = index + 1;
                    return true;
                }
                return false;
            });
            this.dateLoop();
        }
        return this.dates;
    }

    protected dateLoop(): void
    {
        let counter = 0;
        breakBlock:
            while (true) {
                let limitDate = addYears(this.startDate, 1);
                for (;this.currentIndex < this.weekDays.length; this.currentIndex++) {
                    if(counter === 300) break breakBlock;
                    const dayOfWeek = this.weekDays[this.currentIndex];
                    const days = dayOfWeek - this.currentDayOfWeek;
                    this.currentDayOfWeek = dayOfWeek;
                    this.currentDate = addDays(this.currentDate, days);
                    if(compareAsc(this.currentDate, limitDate) === 1) break breakBlock;
                    if(this.isLoopMustBreakOff()) break breakBlock;
                    this.dates.push(getISODate(this.currentDate));
                    counter++;
                }
                this.currentIndex = 0;
                this.toStartOfWeek();
            }
    }

    abstract isLoopMustBreakOff(): boolean;

    private toStartOfWeek(): void
    {
        this.currentDate = addDays(this.currentDate, 7 - this.currentDayOfWeek);
        this.currentDayOfWeek = 0;
    }
}
