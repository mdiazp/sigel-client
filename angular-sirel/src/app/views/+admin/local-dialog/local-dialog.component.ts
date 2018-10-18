import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { Observable, BehaviorSubject } from 'rxjs';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSlideToggle,
  MatCheckboxChange,
  MatSelect,
  MatSelectChange,
} from '@angular/material';

import {
  ApiService,
  ErrorHandlerService
} from '@app/services/core';

import {
  Local,
  WorkingTimeUtil,
  WorkingWeekDay,
  WorkingMonth,
  Area,
} from '@app/models/core';

@Component({
  selector: 'app-local-dialog',
  templateUrl: './local-dialog.component.html',
  styleUrls: ['./local-dialog.component.css']
})
export class LocalDialogComponent implements OnInit {

  title: string;

  opts: Area[] = [];
  private loadingAreasSubject = new BehaviorSubject<boolean>(false);
  private loadingAreas: Observable<boolean>;

  localForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;
  area: FormControl;
  workingBeginTimeHours: FormControl;
  workingBeginTimeMinutes: FormControl;
  workingEndTimeHours: FormControl;
  workingEndTimeMinutes: FormControl;
  @ViewChild(MatSlideToggle) enabled: MatSlideToggle;

  workingTimeUtil = new WorkingTimeUtil();
  wds: WorkingWeekDay[] = [];
  wms: WorkingMonth[] = [];

  constructor(public dialogRef: MatDialogRef<LocalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { local: Local, edit: boolean },
              private api: ApiService,
              private errh: ErrorHandlerService) {
    this.title = this.data.edit ? 'Editar' : 'Crear';

    this.loadingAreas = this.loadingAreasSubject.asObservable();

    this.wds = this.workingTimeUtil.GetWorkingWeekDays( this.data.local.WorkingWeekDays );
    this.wms = this.workingTimeUtil.GetWorkingMonths( this.data.local.WorkingMonths );
  }

  ngOnInit() {
    this.loadAreas();
    this.initForm();
  }

  initForm() {
    this.initFormControls();
    this.localForm = new FormGroup({
      area: this.area,
      name: this.name,
      description : this.description,
      location : this.location,
      wbth: this.workingBeginTimeHours,
      wbtm: this.workingBeginTimeMinutes,
      weth: this.workingEndTimeHours,
      wetm: this.workingEndTimeMinutes,
    });
  }

  initFormControls() {
    this.area = new FormControl(this.data.local.AreaID, Validators.required);
    this.name = new FormControl(this.data.local.Name, Validators.required);
    this.description = new FormControl(this.data.local.Description, Validators.required);
    this.location = new FormControl(this.data.local.Location, Validators.required);
    this.workingBeginTimeHours = new FormControl(
      this.data.local.WorkingBeginTimeHours,
      [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.workingBeginTimeMinutes = new FormControl(
      this.data.local.WorkingBeginTimeMinutes,
      [Validators.required, Validators.min(0), Validators.max(59)]
    );
    this.workingEndTimeHours = new FormControl(
      this.data.local.WorkingEndTimeHours,
      [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.workingEndTimeMinutes = new FormControl(
      this.data.local.WorkingEndTimeMinutes,
      [Validators.required, Validators.min(0), Validators.max(59)]
    );
  }

  onSubmit() {
    const local = new Local(
      this.data.local.ID,
      Number(this.area.value),
      this.name.value,
      this.description.value,
      this.location.value,
      this.workingTimeUtil.GetWorkingMonthsConfig(this.wms),
      this.workingTimeUtil.GetWorkingWeekDaysConfig(this.wds),
      Number(this.workingBeginTimeHours.value),
      Number(this.workingBeginTimeMinutes.value),
      Number(this.workingEndTimeHours.value),
      Number(this.workingEndTimeMinutes.value),
      this.enabled.checked,
    );
    let obs: Observable<Local>;
    obs = this.data.edit ? this.api.AdminPatchLocal(local) : this.api.AdminPostLocal(local);

    obs.subscribe(
      (data) => {
        console.log(data);
        this.dialogRef.close();
      },
      (err) => this.errh.HandleError(err)
    );
  }

  loadAreas(): void {
    this.loadingAreasSubject.next(true);
    this.api.AdminGetAreasList().subscribe(
      (areas) => {
        this.opts = areas;
        this.loadingAreasSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
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
