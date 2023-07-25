export function getISODate(date: Date): string {
    const month = getFullDatePart(date.getMonth() + 1);
    const day = getFullDatePart(date.getDate());
    return `${date.getFullYear()}-${month}-${day}`;
}
function getFullDatePart (datePart: number): string {
    if(datePart < 10) return '0' + String(datePart);
    return String(datePart);
}