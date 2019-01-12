"use strict";
class Auditory {
    constructor(auditory_name) {
        this.auditory_name = auditory_name;
    }
}
class Teacher {
    constructor(teacher_name, teacher_shortname) {
        this.teacher_name = teacher_name;
        if (teacher_shortname)
            this.teacher_shortname = teacher_shortname;
    }
}
class Lesson {
    constructor(lesson) {
        // public time_number: number;
        this.teachers = [];
        this.auditories = [];
        this.parity = null;
        this.subject = lesson.Lesson;
        const types = 'пр_лаб_л_?_конс_вне_зач_экз'.split('_');
        this.type = types.indexOf(lesson.LessonType);
        this.time_start = lesson.StartTime;
        this.teachers = [new Teacher(lesson.FIO, lesson.FIOshort)];
        this.auditories = [new Auditory(lesson.Room)];
        this.parity = lesson.Odd;
    }
}
class Day {
    constructor(weekday, lessons) {
        this.lessons = [];
        this.weekday = weekday;
        if (lessons)
            this.lessons = lessons;
    }
}
class Schedule {
    constructor(group_name, days = []) {
        this.group_name = group_name;
        this.days = days;
    }
}
const s = require('./public/data/schedule/1069/17339.json');
let day = null;
// let days: Day[] = [];
let lesson = null;
let lessons;
let schedule = new Schedule('ММен-17');
for (let i = 0; i < s.length; i++) {
    let d = s[i].WeekDay;
    if (!schedule.days[d]) {
        schedule.days[d] = new Day(d);
        schedule.days[d].lessons.push(new Lesson(s[i]));
    }
    else {
    }
}
if (day)
    schedule.days.push(day);
console.log(schedule);
// console.log(JSON.stringify(schedule, null, 2));
