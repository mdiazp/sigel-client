import { Component, OnInit, Inject } from '@angular/core';
import { Local, Util, WorkingTimeUtil, WorkingMonth, WorkingWeekDay } from '@app/models/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-public-local-details-dialog',
  templateUrl: './public-local-details-dialog.component.html',
  styleUrls: ['./public-local-details-dialog.component.css']
})
export class PublicLocalDetailsDialogComponent implements OnInit {

  workingTimeUtil = new WorkingTimeUtil();
  util = new Util();
  local: Local;

  wms: WorkingMonth[] = [];
  wds: WorkingWeekDay[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.local = data.local;
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

  ngOnInit() {
    const wms = new Array<WorkingMonth>();
    const tmp = this.workingTimeUtil.GetWorkingMonths(this.local.WorkingMonths);
    for ( const wm of tmp ) {
      if ( wm.working ) {
        wms.push(wm);
      }
    }
    this.wms = wms;

    const wds = new Array<WorkingWeekDay>();
    const tmp2 = this.workingTimeUtil.GetWorkingWeekDays(this.local.WorkingWeekDays);
    for ( const wd of tmp2 ) {
      if ( wd.working ) {
        wds.push(wd);
      }
    }
    this.wds = wds;
  }
}
