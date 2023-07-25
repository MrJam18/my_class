declare module 'knex/types/tables' {
    interface Lesson {
        id: number,
        date: string,
        title: string,
        status: number
    }
    interface Tables {
        lessons: Lesson
    }
}