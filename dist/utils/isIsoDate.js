"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIsoDate = void 0;
function isIsoDate(date) {
    const regex = /^\d{4}-[01]\d-[0123]\d$/;
    return regex.test(date);
}
exports.isIsoDate = isIsoDate;
//# sourceMappingURL=isIsoDate.js.map