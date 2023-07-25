"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const ShowableError_1 = require("../errors/ShowableError");
const CountWeekParserService_1 = require("../Services/WeekParsers/CountWeekParserService");
const EndDateWeekParserService_1 = require("../Services/WeekParsers/EndDateWeekParserService");
const getISODate_1 = require("../utils/getISODate");
const isIsoDate_1 = require("../utils/isIsoDate");
const isNumeric_1 = require("../utils/isNumeric");
class LessonsController {
    constructor() {
        this.getList = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = req.query;
                if (!filter.page)
                    filter.page = '1';
                if (!filter.lessonsPerPage)
                    filter.lessonsPerPage = '5';
                const lessonsQuery = (0, db_1.default)('lessons');
                if (filter.date) {
                    const date = this.getSplitted(filter.date, 3);
                    if (date.length === 3)
                        throw new ShowableError_1.ShowableError('Должна быть одна дата для получения фильтра по конкретной дате либо две даты для фильтра по диапазону');
                    date.forEach(function (value) {
                        if (!(0, isIsoDate_1.isIsoDate)(value))
                            throw new ShowableError_1.ShowableError('Дата должна быть в ISO формате. Пример: 2021-11-12');
                    });
                    if (date.length === 1) {
                        lessonsQuery.where('date', date[0]);
                    }
                    else {
                        /*@ts-ignore */
                        lessonsQuery.whereBetween('date', date);
                    }
                }
                if (filter.status) {
                    if (Number(filter.status) > 1 || Number(filter.status) < 0)
                        throw new ShowableError_1.ShowableError('Статус должен быть значением 1 либо 0');
                    lessonsQuery.where('status', filter.status);
                }
                if (filter.studentsCount) {
                    const studentsCount = this.getSplitted(filter.studentsCount, 3);
                    if (studentsCount.length === 3)
                        throw new ShowableError_1.ShowableError('Должна быть одно количество студентов для получения фильтра по конкретному количеству студентов либо два числа через запятую для фильтра по диапазону');
                    studentsCount.forEach(function (val) {
                        if (!(0, isNumeric_1.isNumeric)(val))
                            throw new ShowableError_1.ShowableError('количество студентов должно быть числом');
                    });
                    lessonsQuery.whereIn('id', function () {
                        this.from(function () {
                            this.from('lesson_students')
                                .groupBy('lesson_students.lesson_id')
                                .select('lesson_students.lesson_id')
                                .count('* as count')
                                .as('count_table');
                        })
                            .select('count_table.lesson_id');
                        if (studentsCount.length === 1) {
                            this.where('count', '=', studentsCount[0]);
                        }
                        else {
                            /*@ts-ignore */
                            this.whereBetween('count', studentsCount);
                        }
                    });
                }
                if (filter.teacherIds) {
                    const teacherIds = this.getSplitted(filter.teacherIds);
                    teacherIds.forEach(function (value) {
                        if (!(0, isNumeric_1.isNumeric)(value))
                            throw new ShowableError_1.ShowableError('Идентификаторы учителей должны быть числом');
                    });
                    lessonsQuery.whereExists(function () {
                        this.from('teachers')
                            .join('lesson_teachers', 'lesson_teachers.teacher_id', 'teachers.id')
                            .whereIn('teachers.id', teacherIds)
                            .whereRaw('lessons.id = lesson_teachers.lesson_id')
                            .select('lesson_teachers.lesson_id');
                    });
                }
                const lessonsCountQuery = lessonsQuery.clone().count();
                const page = Number(filter.page);
                if (isNaN(page))
                    throw new ShowableError_1.ShowableError('Страница должна быть числом');
                const limit = Number(filter.lessonsPerPage);
                if (isNaN(limit))
                    throw new ShowableError_1.ShowableError('Количество записей на страницу должно быть числом');
                const offset = Number(filter.page) * limit - limit;
                lessonsQuery.offset(offset).limit(limit);
                const lessons = yield lessonsQuery;
                const lessonIds = lessons.map((lesson) => {
                    return lesson.id;
                });
                const teachersQuery = (0, db_1.default)('teachers').join('lesson_teachers', 'teachers.id', 'lesson_teachers.teacher_id')
                    /* @ts-ignore */
                    .whereIn('lesson_teachers.lesson_id', lessonIds)
                    .select('teachers.id', 'teachers.name', 'lesson_teachers.lesson_id');
                const studentsQuery = (0, db_1.default)('students')
                    .join('lesson_students', 'students.id', 'lesson_students.student_id')
                    /*@ts-ignore*/
                    .whereIn('lesson_students.lesson_id', lessonIds)
                    .select('students.id', 'students.name', 'lesson_students.visit', 'lesson_students.lesson_id');
                const promises = Promise.all([teachersQuery, studentsQuery, lessonsCountQuery]);
                let [teachers, students, lessonsCount] = yield promises;
                const items = lessons.map(function (lesson) {
                    lesson.date = (0, getISODate_1.getISODate)(lesson.date);
                    const lessonTeachers = [];
                    const lessonStudents = [];
                    let visitCount = 0;
                    teachers = teachers.filter(function (teacher) {
                        if (teacher.lesson_id === lesson.id) {
                            delete teacher.lesson_id;
                            lessonTeachers.push(teacher);
                            return false;
                        }
                        return true;
                    });
                    students = students.filter(function (student) {
                        if (student.lesson_id === lesson.id) {
                            delete student.lesson_id;
                            lessonStudents.push(student);
                            if (student.visit)
                                visitCount++;
                            return false;
                        }
                        return true;
                    });
                    lesson.teachers = lessonTeachers;
                    lesson.students = lessonStudents;
                    lesson.visitCount = visitCount;
                    return lesson;
                });
                let lessonsQuantity = Number(lessonsCount[0].count);
                let totalPages = lessonsQuantity / limit;
                totalPages = Math.floor(totalPages);
                if (lessonsQuantity % limit)
                    totalPages++;
                return res.json({
                    items,
                    totalPages
                });
            }
            catch (e) {
                next(e);
            }
        });
        this.createLesson = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const must = [
                    { name: 'teacherIds', type: 'array', required: true },
                    { name: 'title', type: 'string', required: true },
                    { name: 'days', type: 'array', required: true },
                    { name: 'firstDate', type: 'date', required: true },
                    { name: 'lastDate', type: 'date' },
                    { name: 'lessonsCount', type: 'number' }
                ];
                const body = req.body;
                must.forEach(function (value) {
                    const data = body[value.name];
                    if (value.required && !data)
                        throw new ShowableError_1.ShowableError(`Отсутствует обязательное значение ${value.name} в теле запроса`);
                    else if (data && value.type === 'array') {
                        if (!Array.isArray(data))
                            throw new ShowableError_1.ShowableError(`${value.name} должно быть массивом`);
                        data.forEach(function (val) {
                            if (typeof val !== 'number')
                                throw new ShowableError_1.ShowableError(`Значения в массиве ${value.name} должны быть числами`);
                        });
                    }
                    else if (data && value.type === 'date') {
                        if (!(0, isIsoDate_1.isIsoDate)(data))
                            throw new ShowableError_1.ShowableError('Данное значение должно быть датой в ISO формате');
                    }
                    else {
                        if (data && typeof data !== value.type)
                            throw new ShowableError_1.ShowableError(`Значение ${value.name} должно быть в формате ${value.type}`);
                    }
                });
                if (body.lessonsCount && body.lastDate) {
                    throw new ShowableError_1.ShowableError('должен быть указан только один параметр: lessonsCount либо lastDate');
                }
                let dates;
                body.days = body.days.sort(function (a, b) {
                    if (a > 6 || b > 6)
                        throw new ShowableError_1.ShowableError('Числа в массиве в days не должны быть больше 6');
                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    throw new ShowableError_1.ShowableError('Не должно быть повторяющихся чисел в массиве days');
                });
                if (body.lessonsCount) {
                    const parser = new CountWeekParserService_1.CountWeekParserService(body.firstDate, body.days, body.lessonsCount);
                    dates = parser.getDates();
                }
                else if (body.lastDate) {
                    const parser = new EndDateWeekParserService_1.EndDateWeekParserService(body.firstDate, body.days, body.lastDate);
                    dates = parser.getDates();
                }
                else
                    throw new ShowableError_1.ShowableError('Вы должны передать один параметр, либо lastDate либо lessonsCount для установления дат');
                const inserted = dates.map(function (date) {
                    return {
                        date,
                        title: body.title,
                        status: 0
                    };
                });
                const lessons = yield (0, db_1.default)('lessons').insert(inserted, 'id');
                const lessonTeacherInserted = [];
                const lessonIds = [];
                lessons.forEach(function (lesson) {
                    body.teacherIds.forEach(function (teacherId) {
                        lessonTeacherInserted.push({ lesson_id: lesson.id, teacher_id: teacherId });
                    });
                    lessonIds.push(lesson.id);
                });
                try {
                    yield (0, db_1.default)('lesson_teachers').insert(lessonTeacherInserted);
                }
                catch (e) {
                    if (e.code === '23503') {
                        throw new ShowableError_1.ShowableError('Некоторые идентификаторы учителей не существуют');
                    }
                    throw e;
                }
                return res.json(lessonIds);
            }
            catch (e) {
                next(e);
            }
        });
        this.getOne = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            const lesson = yield (0, db_1.default)('lessons').where('id', id).first();
            // @ts-ignore
            lesson.date = (0, getISODate_1.getISODate)(lesson.date);
            return res.json(lesson);
        });
    }
    getSplitted(value, limit = undefined) {
        const array = value.split(',', limit);
        return array.map((value) => value.trim());
    }
}
exports.default = new LessonsController();
//# sourceMappingURL=LessonsController.js.map