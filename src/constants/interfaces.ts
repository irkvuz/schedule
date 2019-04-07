export interface ITrimester {
  IdTrimester: number;
  uYear: string;
  dateStart: Date;
  dateFinish: Date;
  week: number;
  Error: string;
}

export interface ILessonOld {
  WeekDay: number;
  StartTime: string;
  Odd: number;
  Lesson: string;
  LessonType: string;
  Room: string;
  FIO: string;
  FIOshort: string;
  Error: string | null;
}
