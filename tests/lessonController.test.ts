import {execute} from "@getvim/execute";
import {describe, expect, test, } from '@jest/globals';
import {compareAsc} from "date-fns";
import request from "supertest";
import app from "../app";
import {CreateData, Filter} from "../controllers/LessonsController";
import db from "../db";
import {Lesson} from "../models/Lesson";
import {Teacher} from "../models/Teacher";

let mockReq = request(app);

describe('test lessons list', function () {
    test('default behavior test', async function () {
        const response = await mockReq.get('/api');
        expect(response.statusCode).toBe(200);
        expect(response.body.items.length).toBe(5);
        expect(response.body.totalPages).toBe(2);
    });
    test('pages test', async function () {
        const body = await apiTest({page: '2'})
        expect(body.items[0].id).toBe(1);
    });
    test('per page test', async function () {
        const body = await apiTest({lessonsPerPage: '10'});
        expect(body.totalPages).toBe(1);
        expect(body.items.length).toBe(10);
    });
    test('one date filter test', async function () {
        const body = await apiTest({date: "2019-09-03"});
        expect(body.items[0].date).toBe('2019-09-03');
    });
    test('two dates filter test', async function () {
        const body = await apiTest({date: '2019-05-10,2019-05-15'});
        expect(body.items[0].date).toBe('2019-05-10');
        expect(body.items[1].date).toBe('2019-05-15');
    });
    test('status filter teset', async function () {
        const body = await apiTest({status: '1'});
        body.items.forEach(function (lesson: Lesson) {
            expect(lesson.status).toBe(1);
        });
    });
    test('teacher ids filter test', async function () {
        const teacherIds = '1, 3';
        const body = await apiTest({teacherIds});
        const teacherIdsArr = teacherIds.split(', ');
        body.items.forEach(function (lesson: Lesson) {
            const teacher = lesson.teachers.find(function (teacher: Teacher) {
                const find = teacherIdsArr.find((id) => Number(id) === teacher.id);
                if(find) return true;
            });
            expect(teacher).toBeDefined();
        });
    });
    test('students count test', async function () {
        const studentsCount = '1';
        const body = await apiTest({studentsCount});
        body.items.forEach(function (lesson: Lesson) {
            expect(lesson.students.length).toBe(Number(studentsCount));
        });
    });
    test('student count diapason test', async function () {
        const studentsCount = '1, 4';
        const body = await apiTest({studentsCount});
        // @ts-ignore
        let studentsCountArr = studentsCount.split(', ') as number[];
        studentsCountArr = studentsCountArr.map((val) => Number(val));
        body.items.forEach(function (lesson: Lesson) {
            expect(lesson.students.length).toBeGreaterThanOrEqual(studentsCountArr[0]);
            expect(lesson.students.length).toBeLessThanOrEqual(studentsCountArr[1]);
        });
    });
});

describe('create lessons test', function () {
    test('with count test', async function () {
        const data = getDefaultCreateData();
        data.lessonsCount = 5;
        const body = await createTest(data);
        expect(body.length).toBe(data.lessonsCount);
        const first = await mockReq.get('/api/get-one?id=' + body[0]);
        expect(first.body.date).toBe('2015-08-18');
    });
    test('with end date test', async function () {
        const data = getDefaultCreateData();
        data.lastDate = '2015-08-27';
        const resData = await createTest(data);
        expect(resData.length).toBe(4);
        const last = await getOne(resData.at(-1));
        expect(last.date).toBe('2015-08-27');
    });
    test('count limit test', async function () {
        const data = getDefaultCreateData();
        data.lessonsCount = 500;
        data.days = [0, 1, 2, 3, 4, 5, 6];
        const lessons = await createTest(data);
        expect(lessons.length).toBe(300);
    });
    test('date limit test', async function () {
        const data = getDefaultCreateData();
        data.lessonsCount = 500;
        data.days = [1];
        const lessons = await createTest(data);
        const lastLesson = await getOne(lessons.at(-1));
        const result = compareAsc(new Date('2016-08-18'), new Date(lastLesson.date));
        expect(result).toBe(1);
    });
    test('error if days equals', async function () {
        const data = getDefaultCreateData();
        data.lessonsCount = 10;
        data.days = [1, 2, 2, 5];
        await createTest(data, 400);
    });
    test('error if date not in format test', async function () {
        const data = getDefaultCreateData();
        data.lessonsCount = 10;
        data.firstDate = '17/04/1994';
        await createTest(data, 400);
    });
    test('error if teacher dont exists', async function () {
        const data = getDefaultCreateData();
        data.teacherIds.push(55);
        data.lessonsCount = 10;
        await createTest(data, 400);
    });
});

async function getOne(id: number): Promise<Lesson>
{
    return (await mockReq.get('/api/get-one?id=' + id)).body;
}
function getDefaultCreateData(): CreateData {
    return {
        teacherIds: [1, 3],
        title: 'test',
        days: [2, 4],
        firstDate: '2015-08-17'
    }
}
async function apiTest(query: Filter = {}, expectStatus = 200): Promise<Record<string, any>> {
   const response = await mockReq.get('/api')
        .query(query)
        .expect(expectStatus);
   return response.body;
}
async function createTest(query: CreateData, expectStatus = 200): Promise<number[]> {
    const response = await mockReq.post('/api/lessons')
        .send(query)
        .expect(expectStatus);
    return response.body;
}

beforeAll( function () {
    return execute('psql -f test.sql ' + process.env.TEST_DB);
});
afterAll(async () => {
    const schema = db.schema;
    await schema.dropTableIfExists('lesson_students');
    await schema.dropTableIfExists('lesson_teachers');
    await schema.dropTableIfExists('lessons');
    await schema.dropTableIfExists('students');
    await schema.dropTableIfExists('teachers');
    await db.destroy();
});


