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
const execute_1 = require("@getvim/execute");
const globals_1 = require("@jest/globals");
const date_fns_1 = require("date-fns");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../db"));
let mockReq = (0, supertest_1.default)(app_1.default);
(0, globals_1.describe)('test lessons list', function () {
    (0, globals_1.test)('default behavior test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield mockReq.get('/api');
            (0, globals_1.expect)(response.statusCode).toBe(200);
            (0, globals_1.expect)(response.body.items.length).toBe(5);
            (0, globals_1.expect)(response.body.totalPages).toBe(2);
        });
    });
    (0, globals_1.test)('pages test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield apiTest({ page: '2' });
            (0, globals_1.expect)(body.items[0].id).toBe(1);
        });
    });
    (0, globals_1.test)('per page test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield apiTest({ lessonsPerPage: '10' });
            (0, globals_1.expect)(body.totalPages).toBe(1);
            (0, globals_1.expect)(body.items.length).toBe(10);
        });
    });
    (0, globals_1.test)('one date filter test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield apiTest({ date: "2019-09-03" });
            (0, globals_1.expect)(body.items[0].date).toBe('2019-09-03');
        });
    });
    (0, globals_1.test)('two dates filter test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield apiTest({ date: '2019-05-10,2019-05-15' });
            (0, globals_1.expect)(body.items[0].date).toBe('2019-05-10');
            (0, globals_1.expect)(body.items[1].date).toBe('2019-05-15');
        });
    });
    (0, globals_1.test)('status filter teset', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield apiTest({ status: '1' });
            body.items.forEach(function (lesson) {
                (0, globals_1.expect)(lesson.status).toBe(1);
            });
        });
    });
    (0, globals_1.test)('teacher ids filter test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const teacherIds = '1, 3';
            const body = yield apiTest({ teacherIds });
            const teacherIdsArr = teacherIds.split(', ');
            body.items.forEach(function (lesson) {
                const teacher = lesson.teachers.find(function (teacher) {
                    const find = teacherIdsArr.find((id) => Number(id) === teacher.id);
                    if (find)
                        return true;
                });
                (0, globals_1.expect)(teacher).toBeDefined();
            });
        });
    });
    (0, globals_1.test)('students count test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const studentsCount = '1';
            const body = yield apiTest({ studentsCount });
            body.items.forEach(function (lesson) {
                (0, globals_1.expect)(lesson.students.length).toBe(Number(studentsCount));
            });
        });
    });
    (0, globals_1.test)('student count diapason test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const studentsCount = '1, 4';
            const body = yield apiTest({ studentsCount });
            // @ts-ignore
            let studentsCountArr = studentsCount.split(', ');
            studentsCountArr = studentsCountArr.map((val) => Number(val));
            body.items.forEach(function (lesson) {
                (0, globals_1.expect)(lesson.students.length).toBeGreaterThanOrEqual(studentsCountArr[0]);
                (0, globals_1.expect)(lesson.students.length).toBeLessThanOrEqual(studentsCountArr[1]);
            });
        });
    });
});
(0, globals_1.describe)('create lessons test', function () {
    (0, globals_1.test)('with count test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = getDefaultCreateData();
            data.lessonsCount = 5;
            const body = yield createTest(data);
            (0, globals_1.expect)(body.length).toBe(data.lessonsCount);
            const first = yield mockReq.get('/api/get-one?id=' + body[0]);
            (0, globals_1.expect)(first.body.date).toBe('2015-08-18');
        });
    });
    (0, globals_1.test)('with end date test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = getDefaultCreateData();
            data.lastDate = '2015-08-27';
            const resData = yield createTest(data);
            (0, globals_1.expect)(resData.length).toBe(4);
            const last = yield getOne(resData.at(-1));
            (0, globals_1.expect)(last.date).toBe('2015-08-27');
        });
    });
    (0, globals_1.test)('count limit test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = getDefaultCreateData();
            data.lessonsCount = 500;
            data.days = [0, 1, 2, 3, 4, 5, 6];
            const lessons = yield createTest(data);
            (0, globals_1.expect)(lessons.length).toBe(300);
        });
    });
    (0, globals_1.test)('date limit test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = getDefaultCreateData();
            data.lessonsCount = 500;
            data.days = [1];
            const lessons = yield createTest(data);
            const lastLesson = yield getOne(lessons.at(-1));
            const result = (0, date_fns_1.compareAsc)(new Date('2016-08-18'), new Date(lastLesson.date));
            (0, globals_1.expect)(result).toBe(1);
        });
    });
    (0, globals_1.test)('error if days equals', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = getDefaultCreateData();
            data.lessonsCount = 10;
            data.days = [1, 2, 2, 5];
            yield createTest(data, 400);
        });
    });
    (0, globals_1.test)('error if date not in format test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = getDefaultCreateData();
            data.lessonsCount = 10;
            data.firstDate = '17/04/1994';
            yield createTest(data, 400);
        });
    });
    (0, globals_1.test)('error if teacher dont exists', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = getDefaultCreateData();
            data.teacherIds.push(55);
            data.lessonsCount = 10;
            yield createTest(data, 400);
        });
    });
});
function getOne(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield mockReq.get('/api/get-one?id=' + id)).body;
    });
}
function getDefaultCreateData() {
    return {
        teacherIds: [1, 3],
        title: 'test',
        days: [2, 4],
        firstDate: '2015-08-17'
    };
}
function apiTest(query = {}, expectStatus = 200) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield mockReq.get('/api')
            .query(query)
            .expect(expectStatus);
        return response.body;
    });
}
function createTest(query, expectStatus = 200) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield mockReq.post('/api/lessons')
            .send(query)
            .expect(expectStatus);
        return response.body;
    });
}
beforeAll(function () {
    return (0, execute_1.execute)('psql -f test.sql ' + process.env.TEST_DB);
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const schema = db_1.default.schema;
    yield schema.dropTableIfExists('lesson_students');
    yield schema.dropTableIfExists('lesson_teachers');
    yield schema.dropTableIfExists('lessons');
    yield schema.dropTableIfExists('students');
    yield schema.dropTableIfExists('teachers');
    yield db_1.default.destroy();
}));
//# sourceMappingURL=lessonController.test.js.map