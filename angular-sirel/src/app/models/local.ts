import { Time } from '@angular/common';
import {
  User
} from '@app/models/core';

export class Local {
  constructor(public id: number,
              public area_id: number,
              public name: string,
              public description: string,
              public location: string,
              public working_months: string,
              public working_week_days: string,
              public working_begin_time_hours: number,
              public working_begin_time_minutes: number,
              public working_end_time_hours: number,
              public working_end_time_minutes: number,
              public enable_to_reserve: boolean,
              public admins?: User[]) {}
}
