class Auditory {
  public auditory_name: string;
  constructor(auditory_name: string) {
    this.auditory_name = auditory_name;
  }
}

class Teacher {
  public teacher_name: string;
  public teacher_shortname?: string;
  constructor(teacher_name: string, teacher_shortname?: string) {
    this.teacher_name = teacher_name;
    if (teacher_shortname) this.teacher_shortname = teacher_shortname;
  }
}

class Lesson {
  public subject: string;
  public type: number;
  public time_start: string;
  // public time_number: number;
  public teachers: Teacher[] = [];
  public auditories: Auditory[] = [];
  public parity?: number | null = null;

  constructor(lesson: iLessonOld) {
    this.subject = lesson.Lesson;
    const types = 'пр_лаб_л_?_конс_вне_зач_экз'.split('_');
    this.type = types.indexOf(lesson.LessonType);
    this.time_start = lesson.StartTime;
    this.teachers = [new Teacher(lesson.FIO, lesson.FIOshort)];
    this.auditories = [new Auditory(lesson.Room)];
    this.parity = lesson.Odd;
  }

  // static generate(
  //   subject: string,
  //   type: number,
  //   time_number: number,
  //   teachers: Teacher[] = [],
  //   auditories: Auditory[] = [],
  //   parity: number | null = null
  // ) {
  //   this.subject = subject;
  //   this.type = type;
  //   this.time_number = time_number;
  //   this.teachers = teachers;
  //   this.auditories = auditories;
  //   this.parity = parity;
  // }
}

class Day {
  public weekday: number;
  public lessons: Lesson[] = [];
  constructor(weekday: number, lessons?: Lesson[]) {
    this.weekday = weekday;
    if (lessons) this.lessons = lessons;
  }
}

class Schedule {
  public group_name: string;
  public days: Day[];
  constructor(group_name: string, days: Day[] = []) {
    this.group_name = group_name;
    this.days = days;
  }
}

interface iLessonOld {
  WeekDay: number;
  StartTime: string;
  Odd: number;
  Lesson: string;
  LessonType: string;
  Room: string;
  FIO: string;
  FIOshort: string;
  Error: string;
}

const s: iLessonOld[] = require('./public/data/schedule/1069/17339.json');

let day: Day | null = null;
// let days: Day[] = [];
let lesson: Lesson | null = null;
let lessons: Lesson[];

let schedule = new Schedule('ММен-17');

for (let i = 0; i < s.length; i++) {
  let d = s[i].WeekDay;
  if (!schedule.days[d]) {
    schedule.days[d] = new Day(d);
    schedule.days[d].lessons.push(new Lesson(s[i]));
  } else {
    if (schedule.days[d].lessons) {
      let l0 = schedule.days[d].lessons[0];
      if (
        l0.time_start == s[i].StartTime &&
        l0.parity == s[i].Odd &&
        l0.subject == s[i].Lesson
      ) {
      }
    }
  }
}
if (day) schedule.days.push(day);
console.log(schedule);
// console.log(JSON.stringify(schedule, null, 2));
