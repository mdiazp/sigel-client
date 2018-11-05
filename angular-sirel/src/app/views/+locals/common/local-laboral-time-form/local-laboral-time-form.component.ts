import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatCheckboxChange, MatSelectChange } from '@angular/material';

import {
  Local, WorkingTimeUtil,
  WorkingMonth, WorkingWeekDay
} from '@app/models/core';

@Component({
  selector: 'app-local-laboral-time-form',
  templateUrl: './local-laboral-time-form.component.html',
  styleUrls: ['./local-laboral-time-form.component.css']
})
export class LocalLaboralTimeFormComponent implements OnInit {

  @Input() local: LocalLaboralTime;
  @Output() Submit = new EventEmitter<LocalLaboralTime>();
  localLaboralTimeSubmitted = new LocalLaboralTime('', '', 0, 0, 0, 0);

  localForm: FormGroup;
  workingBeginTimeHours: FormControl;
  workingBeginTimeMinutes: FormControl;
  workingEndTimeHours: FormControl;
  workingEndTimeMinutes: FormControl;

  workingTimeUtil = new WorkingTimeUtil();
  wds: WorkingWeekDay[] = [];
  wms: WorkingMonth[] = [];

  constructor() { }

  ngOnInit() {
    this.wds = this.workingTimeUtil.GetWorkingWeekDays( this.local.WorkingWeekDays );
    this.wms = this.workingTimeUtil.GetWorkingMonths( this.local.WorkingMonths );
    this.initForm();
  }

  initForm(): void {
    this.localLaboralTimeSubmitted = this.local;

    this.workingBeginTimeHours = new FormControl(
      this.local.WorkingBeginTimeHours,
      [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.workingBeginTimeMinutes = new FormControl(
      this.local.WorkingBeginTimeMinutes,
      [Validators.required, Validators.min(0), Validators.max(59)]
    );
    this.workingEndTimeHours = new FormControl(
      this.local.WorkingEndTimeHours,
      [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.workingEndTimeMinutes = new FormControl(
      this.local.WorkingEndTimeMinutes,
      [Validators.required, Validators.min(0), Validators.max(59)]
    );
    this.localForm = new FormGroup({
      'wbth': this.workingBeginTimeHours,
      'wbtm': this.workingBeginTimeMinutes,
      'weth': this.workingEndTimeHours,
      'wetm': this.workingEndTimeMinutes,
    });
  }

  onSubmit() {
    this.localLaboralTimeSubmitted = new LocalLaboralTime(
      this.workingTimeUtil.GetWorkingMonthsConfig(this.wms),
      this.workingTimeUtil.GetWorkingWeekDaysConfig(this.wds),
      Number(this.workingBeginTimeHours.value),
      Number(this.workingBeginTimeMinutes.value),
      Number(this.workingEndTimeHours.value),
      Number(this.workingEndTimeMinutes.value),
    );
    this.Submit.emit(this.localLaboralTimeSubmitted);
  }

  ChangeWorkingMonthStatus(wm: WorkingMonth, event: MatCheckboxChange) {
    wm.working = event.checked;
  }

  ChangeWorkingWeekDayStatus(wd: WorkingWeekDay, event: MatCheckboxChange) {
    wd.working = event.checked;
  }

  ChangeNeedConfirmation(wd: WorkingWeekDay, event: MatSelectChange) {
    wd.needConfirmation = (event.value === 'true');
  }

}

export class LocalLaboralTime {
  constructor(public WorkingMonths: string,
              public WorkingWeekDays: string,
              public WorkingBeginTimeHours: number,
              public WorkingBeginTimeMinutes: number,
              public WorkingEndTimeHours: number,
              public WorkingEndTimeMinutes: number) {}
}
