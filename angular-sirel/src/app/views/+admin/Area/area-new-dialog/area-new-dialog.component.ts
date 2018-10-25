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
  Area,
} from '@app/models/core';

@Component({
  selector: 'app-area-new-dialog',
  templateUrl: './area-new-dialog.component.html',
  styleUrls: ['./area-new-dialog.component.css']
})
export class AreaNewDialogComponent implements OnInit {
  newAreaForm: FormGroup;
  areaName: FormControl;
  area: Area;

  constructor(public dialogRef: MatDialogRef<AreaNewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: { area: Area },
              private api: ApiService,
              private errh: ErrorHandlerService) {
    this.area = data.area;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.initFormControls();
    this.newAreaForm = new FormGroup({
      'areaName': this.areaName,
    });
  }

  initFormControls(): void {
    this.areaName = new FormControl(this.area.Name, this.area.NameValidators);
  }

  onSubmit(): void {
    this.area.Name = this.areaName.value;

    this.api.AdminPostArea(this.area).subscribe(
      (_) => {
        this.dialogRef.close();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
