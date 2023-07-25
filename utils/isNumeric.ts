
export function isNumeric(value): boolean {
    const int = Number(value);
    return !isNaN(int);
}