import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Local, Area, HM, WorkingTimeUtil, WorkingWeekDay, WorkingMonth } from '@app/models/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService, ErrorHandlerService } from '@app/services/core';
import { MatSlider, MatSlideToggle } from '@angular/material';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-local-form',
  templateUrl: './local-form.component.html',
  styleUrls: ['./local-form.component.scss']
})
export class LocalFormComponent implements OnInit, AfterViewInit {

  @Input() initialData = new Local(0, 0, '', '', '', '', '', 0, 0, 0, 0, false);
  @Input() areas: Area[] = [];
  @Input() buttonText = 'Actualizar';
  @Input() showRestablecerButton = false;
  @Input() disableAreaSelection = false;
  @Input() disabledButtons = false;
  @Input() showButtons = true;

  @Output() SubmitForm = new EventEmitter<Local>();

  @ViewChild(MatSlideToggle) enableFC: MatSlideToggle;

  localForm: FormGroup;
  areaFC: FormControl;
  nameFC: FormControl;
  descriptionFC: FormControl;
  locationFC: FormControl;

  wtUtil = new WorkingTimeUtil();

  wms: WorkingMonth[][];
  wwds: WorkingWeekDay[] = [];

  wbtFC: FormControl;
  wetFC: FormControl;

  enable: boolean;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit(): void {
  }

  initForm(): void {
    this.areaFC = new FormControl(
      {
        value: this.initialData.AreaID,
        disabled: this.disableAreaSelection,
      },
      [Validators.required]
    );
    this.nameFC = new FormControl(
      this.initialData.Name,
      [Validators.required, Validators.maxLength(100)],
    );
    this.descriptionFC = new FormControl(
      this.initialData.Description,
      [Validators.required, Validators.maxLength(500)]
    );
    this.locationFC = new FormControl(
      this.initialData.Location,
      [Validators.required, Validators.maxLength(500)]
    );

    const wms = this.wtUtil.GetWorkingMonths(this.initialData.WorkingMonths);
    this.wms = [];
    for ( let i = 0, k = 0; i < 3; i++ ) {
      this.wms[i] = [];
      for ( let j = 0; j < 4; j++ ) {
        this.wms[i][j] = wms[k++];
      }
    }

    this.wwds = this.wtUtil.GetWorkingWeekDays(this.initialData.WorkingWeekDays);

    const bt = new HM(
      this.initialData.WorkingBeginTimeHours,
      this.initialData.WorkingBeginTimeMinutes,
    );
    this.wbtFC = new FormControl(
      bt.toString(),
      [Validators.required]
    );
    const et = new HM(
      this.initialData.WorkingEndTimeHours,
      this.initialData.WorkingEndTimeMinutes,
    );
    this.wetFC = new FormControl(
      et.toString(),
      [Validators.required]
    );

    this.localForm = new FormGroup(
      {
        'area': this.areaFC,
        'name': this.nameFC,
        'description': this.descriptionFC,
        'location': this.locationFC,
        'wbt': this.wbtFC,
        'wet': this.wetFC,
      }
    );

    this.enable = this.initialData.EnableToReserve;
    if (!isNullOrUndefined(this.enableFC)) {
      this.enableFC.checked = this.enable;
    }
  }

  getData(): Local {
    return new Local(
      this.initialData.ID,
      Number(this.areaFC.value),
      this.nameFC.value,
      this.descriptionFC.value,
      this.locationFC.value,
      this.wtUtil.GetWorkingMonthsConfig(this.wms[0].concat(this.wms[1], this.wms[2])),
      this.wtUtil.GetWorkingWeekDaysConfig(this.wwds),
      Number(this.wbtFC.value.slice(0, 2)),
      Number(this.wbtFC.value.slice(3, 5)),
      Number(this.wetFC.value.slice(0, 2)),
      Number(this.wetFC.value.slice(3, 5)),
      this.enable,
    );
  }

  weekDayStatusChange(wwd: WorkingWeekDay): void {
    if (wwd.needConfirmation) {
      wwd.needConfirmation = false;
      wwd.working = false;
    } else if (!wwd.working) {
      wwd.working = true;
    } else {
      wwd.needConfirmation = true;
    }
  }

  validForm(): boolean {
    if ( this.localForm.invalid ) {
      return false;
    }

    const x = this.getData();
    if ( new HM(x.WorkingBeginTimeHours, x.WorkingBeginTimeMinutes).gt(
         new HM(x.WorkingEndTimeHours, x.WorkingEndTimeMinutes))
       ) {
        return false;
    }

    return true;
  }
}
