export interface ITrimesterOld {
  IdTrimester: number;
  uYear: string;
  dateStart: string;
  dateFinish: string;
  week?: number;
  Error?: string;
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

export type IScheduleOld = ILessonOld[];

/** Universal item with `id` and `name` fields */
export interface IItem {
  id: string; // Cascader requires `id` as a String
  name: string;
}

export interface IGroup extends IItem {}

export interface IFaculty extends IItem {
  fullName: string;
}

export interface IFacultyWithGroups extends IFaculty {
  groups: IGroup[];
}

export interface IGroupOld {
  IdGroup: number;
  Group: string;
  Course: number;
  Error: string;
  hasSchedule: boolean;
  trimesterId?: number;
}

export interface IFacultyOld {
  IdFaculty: number;
  FacultyName: string;
  FacultyAbbr: string;
  Error: string;
}
