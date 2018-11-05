import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatSlideToggle, MatCheckboxChange, MatSelectChange } from '@angular/material';

import {
  SessionService,
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';

import {
  Area, Local,
} from '@app/models/core';

@Component({
  selector: 'app-local-info-form',
  templateUrl: './local-info-form.component.html',
  styleUrls: ['./local-info-form.component.css']
})
export class LocalInfoFormComponent implements OnInit {

  @Input() localInfo = new LocalInfo(0, 0, '', '', '');
  @Input() localArea: Area = new Area(0, '', '', '');
  @Input() disabledAreaSelect = false;
  @Output() Submit = new EventEmitter<LocalInfo>();

  areas: Area[] = [];

  localInfoSubmited = new LocalInfo(0, 0, '', '', '');
  localInfoForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;
  area: FormControl;

  constructor(private session: SessionService,
              private api: ApiService,
              private errh: ErrorHandlerService) {
  }

  ngOnInit() {
    this.localInfoSubmited = this.localInfo;

    if ( !this.disabledAreaSelect ) {
      this.loadAreas();
    } else {
      this.areas = [this.localArea];
    }
    this.initForm();
  }

  initForm() {
    this.initFormControls();
    this.localInfoForm = new FormGroup({
      area: this.area,
      name: this.name,
      description : this.description,
      location : this.location,
    });
  }

  initFormControls() {
    this.area = new FormControl(
      {
        value: this.localInfo.AreaID,
        disabled: this.disabledAreaSelect,
      },
      [Validators.required],
    );
    this.name = new FormControl(this.localInfo.Name,
      [Validators.required, Validators.maxLength(100)]);
    this.description = new FormControl(this.localInfo.Description,
      [Validators.required, Validators.maxLength(1024)]);
    this.location = new FormControl(this.localInfo.Location,
      [Validators.required, Validators.maxLength(1024)]);
  }

  onSubmit(): void {
    this.localInfoSubmited = new LocalInfo(
      this.localInfo.ID,
      Number(this.area.value),
      this.name.value,
      this.description.value,
      this.location.value,
    );
    this.Submit.emit(this.localInfoSubmited);
  }

  Reset(local?: Local): void {
    if ( !local || local === null ) {
      this.localInfo = new LocalInfo(0, 0, '', '', '');
    }
    this.area.setValue(Number(this.area.value));
    this.name.setValue(this.localInfo.Name);
    this.description.setValue(this.localInfo.Description);
    this.location.setValue(this.localInfo.Location);
  }

  loadAreas(): void {
    this.api.GetAreas(null, 'admin').subscribe(
      (data) => {
        this.areas = data;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}

export class LocalInfo {
  constructor(public ID: number,
              public AreaID: number,
              public Name: string,
              public Description: string,
              public Location: string) {}
}
