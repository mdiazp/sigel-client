import { Component, OnInit, Input } from '@angular/core';

import {
  Local,
  Area,
  WorkingTimeUtil,
  WorkingMonth,
  WorkingWeekDay,
} from '@app/models/core';
import { ApiService, ErrorHandlerService } from '@app/services/core';

@Component({
  selector: 'app-local-profile',
  templateUrl: './local-profile.component.html',
  styleUrls: ['./local-profile.component.css']
})
export class LocalProfileComponent implements OnInit {

  @Input() local: Local;
  @Input() area: Area;

  working_time_util = new WorkingTimeUtil();
  wms: WorkingMonth[][];
  working_weekdays: WorkingWeekDay[] = [];

  constructor() {}

  ngOnInit() {
    this.prepareInitialData();
  }

  prepareInitialData() {
    const wms = this.working_time_util.GetWorkingMonths(this.local.WorkingMonths);
    this.wms = [];
    for ( let i = 0, k = 0; i < 3; i++ ) {
      this.wms[i] = [];
      for ( let j = 0; j < 4; j++ ) {
        this.wms[i][j] = wms[k++];
      }
    }

    this.working_weekdays =
      this.working_time_util.GetWorkingWeekDays( this.local.WorkingWeekDays );
  }

  showTime(begining: boolean): string {
    if ( begining ) {
      return (this.local.WorkingBeginTimeHours < 10 ? '0' : '') +
              this.local.WorkingBeginTimeHours + ':' +
             (this.local.WorkingBeginTimeMinutes < 10 ? '0' : '') +
              this.local.WorkingBeginTimeMinutes;
    } else {
      return (this.local.WorkingEndTimeHours < 10 ? '0' : '') +
              this.local.WorkingEndTimeHours + ':' +
             (this.local.WorkingEndTimeMinutes < 10 ? '0' : '') +
              this.local.WorkingEndTimeMinutes;
    }
  }
}
