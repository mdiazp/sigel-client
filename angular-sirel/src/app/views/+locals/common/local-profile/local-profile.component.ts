import { Component, OnInit, Input } from '@angular/core';

import {
  Local,
  Area,
  WorkingTimeUtil,
  WorkingMonth,
  WorkingWeekDay,
} from '@app/models/core';

@Component({
  selector: 'app-local-profile',
  templateUrl: './local-profile.component.html',
  styleUrls: ['./local-profile.component.css']
})
export class LocalProfileComponent implements OnInit {

  @Input() local: Local;
  @Input() localArea: Area;

  local_id: string;
  working_time_util = new WorkingTimeUtil();
  working_months: WorkingMonth[];
  working_week_days: WorkingWeekDay[];

  constructor() {}

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.working_months =
    this.working_time_util.GetWorkingMonths( this.local.WorkingMonths );

    this.working_week_days =
    this.working_time_util.GetWorkingWeekDays( this.local.WorkingWeekDays );
  }
}
