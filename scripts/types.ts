import { IFaculty, IFacultyOld, IGroup, IGroupOld } from '../src/constants';

export class Group implements IGroup {
  public id: string;
  public name: string;
  public trimesterId: number;
  constructor(obj: IGroupOld) {
    this.id = String(obj.IdGroup); // Cascader requires `id` as a String
    this.name = obj.Group;
    this.trimesterId = obj.trimesterId;
  }
}

export class Faculty implements IFaculty {
  public id: string;
  public name: string;
  public fullName: string;
  public groups: Group[];
  constructor(obj: IFacultyOld) {
    this.id = String(obj.IdFaculty); // Cascader requires `id` as a String
    this.name = obj.FacultyAbbr;
    this.fullName = obj.FacultyName;
    this.groups = [];
  }
}
