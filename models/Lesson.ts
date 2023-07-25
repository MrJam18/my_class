export interface Lesson extends Record<string, any>{
    id: number,
    date: Date|string,
    title: string,
    status: number
}