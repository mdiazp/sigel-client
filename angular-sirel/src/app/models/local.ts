import { Time } from '@angular/common';
import {
  User
} from '@app/models/core';

export class Local {
  constructor(public ID: number,
              public AreaID: number,
              public Name: string,
              public Description: string,
              public Location: string,
              public WorkingMonths: string,
              public WorkingWeekDays: string,
              public WorkingBeginTimeHours: number,
              public WorkingBeginTimeMinutes: number,
              public WorkingEndTimeHours: number,
              public WorkingEndTimeMinutes: number,
              public EnableToReserve: boolean,
              public Admins?: User[]) {}
}
