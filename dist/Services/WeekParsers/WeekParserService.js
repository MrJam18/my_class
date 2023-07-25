"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekParserService = void 0;
const date_fns_1 = require("date-fns");
const differenceInDays_1 = __importDefault(require("date-fns/differenceInDays"));
const startOfWeek_1 = __importDefault(require("date-fns/startOfWeek"));
const getISODate_1 = require("../../utils/getISODate");
class WeekParserService {
    constructor(startDate, weekDays) {
        this.startDate = new Date(startDate);
        this.weekDays = weekDays;
        this.currentDate = this.startDate;
        this.dates = [];
        this.currentIndex = 0;
    }
    getDates() {
        const weekStart = (0, startOfWeek_1.default)(this.startDate);
        this.currentDayOfWeek = (0, differenceInDays_1.default)(this.startDate, weekStart);
        if (this.currentDayOfWeek < this.weekDays[0]) {
            this.dateLoop();
        }
        else if (this.currentDayOfWeek > this.weekDays.at(-1)) {
            this.toStartOfWeek();
            this.dateLoop();
        }
        else {
            this.weekDays.find((weekDay, index) => {
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
    dateLoop() {
        let counter = 0;
        breakBlock: while (true) {
            let limitDate = (0, date_fns_1.addYears)(this.startDate, 1);
            for (; this.currentIndex < this.weekDays.length; this.currentIndex++) {
                if (counter === 300)
                    break breakBlock;
                const dayOfWeek = this.weekDays[this.currentIndex];
                const days = dayOfWeek - this.currentDayOfWeek;
                this.currentDayOfWeek = dayOfWeek;
                this.currentDate = (0, date_fns_1.addDays)(this.currentDate, days);
                if ((0, date_fns_1.compareAsc)(this.currentDate, limitDate) === 1)
                    break breakBlock;
                if (this.isLoopMustBreakOff())
                    break breakBlock;
                this.dates.push((0, getISODate_1.getISODate)(this.currentDate));
                counter++;
            }
            this.currentIndex = 0;
            this.toStartOfWeek();
        }
    }
    toStartOfWeek() {
        this.currentDate = (0, date_fns_1.addDays)(this.currentDate, 7 - this.currentDayOfWeek);
        this.currentDayOfWeek = 0;
    }
}
exports.WeekParserService = WeekParserService;
//# sourceMappingURL=WeekParserService.js.map