import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';
import {
  Local,
  Area,
} from '@app/models/core';

@Component({
  selector: 'app-local-new-dialog',
  templateUrl: './local-new-dialog.component.html',
  styleUrls: ['./local-new-dialog.component.css']
})
export class LocalNewDialogComponent implements OnInit {
  newLocalForm: FormGroup;
  localArea: FormControl;
  localName: FormControl;
  areas: Area[];
  local: Local;

  constructor(public dialogRef: MatDialogRef<LocalNewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: { local: Local },
              private api: ApiService,
              private errh: ErrorHandlerService) {
    this.local = data.local;
  }

  ngOnInit() {
    this.loadAreas();
    this.initForm();
  }

  initForm(): void {
    this.initFormControls();
    this.newLocalForm = new FormGroup({
      'localArea': this.localArea,
      'localName': this.localName,
    });
  }

  initFormControls(): void {
    this.localArea = new FormControl(this.local.AreaID, this.local.AreaIDValidators);
    this.localName = new FormControl(this.local.Name, this.local.NameValidators);
  }

  loadAreas(): void {
    this.api.AdminGetAreasList().subscribe(
      (data) => {
        this.areas = data;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  onSubmit(): void {
    this.local.Name = this.localName.value;
    this.local.AreaID = this.localArea.value;

    this.api.AdminPostLocal(this.local).subscribe(
      (_) => {
        this.dialogRef.close();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
