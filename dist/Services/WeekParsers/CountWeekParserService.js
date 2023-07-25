"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountWeekParserService = void 0;
const WeekParserService_1 = require("./WeekParserService");
class CountWeekParserService extends WeekParserService_1.WeekParserService {
    constructor(startDate, weekDays, count) {
        super(startDate, weekDays);
        this.counter = 0;
        this.count = count;
    }
    isLoopMustBreakOff() {
        this.counter++;
        return this.count < this.counter;
    }
}
exports.CountWeekParserService = CountWeekParserService;
//# sourceMappingURL=CountWeekParserService.js.map