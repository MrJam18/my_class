"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getISODate = void 0;
function getISODate(date) {
    const month = getFullDatePart(date.getMonth() + 1);
    const day = getFullDatePart(date.getDate());
    return `${date.getFullYear()}-${month}-${day}`;
}
exports.getISODate = getISODate;
function getFullDatePart(datePart) {
    if (datePart < 10)
        return '0' + String(datePart);
    return String(datePart);
}
//# sourceMappingURL=getISODate.js.map