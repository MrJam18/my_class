"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndDateWeekParserService = void 0;
const date_fns_1 = require("date-fns");
const WeekParserService_1 = require("./WeekParserService");
class EndDateWeekParserService extends WeekParserService_1.WeekParserService {
    constructor(startDate, weekDays, endDate) {
        super(startDate, weekDays);
        this.endDate = new Date(endDate);
    }
    isLoopMustBreakOff() {
        return (0, date_fns_1.compareAsc)(this.currentDate, this.endDate) === 1;
    }
}
exports.EndDateWeekParserService = EndDateWeekParserService;
//# sourceMappingURL=EndDateWeekParserService.js.map