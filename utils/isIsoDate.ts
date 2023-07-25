
export function isIsoDate(date: string): boolean {
    const regex = /^\d{4}-[01]\d-[0123]\d$/;
    return regex.test(date);
}