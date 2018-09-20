import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSlideToggle,
} from '@angular/material';

import {
  ApiService
} from '@app/services/api.service';

import {
  ErrorHandlerService
} from '@app/services/error-handler.service';

import { Area } from '@app/models/area';

@Component({
  selector: 'app-create-area-dialog',
  templateUrl: './create-area-dialog.component.html',
  styleUrls: ['./create-area-dialog.component.css']
})
export class CreateAreaDialogComponent implements OnInit {

  createAreaForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;

  @ViewChild(MatSlideToggle) enabled;

  constructor(public dialogRef: MatDialogRef<CreateAreaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private api: ApiService,
              private errh: ErrorHandlerService) {}

  ngOnInit() {
    this.initForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm(): void {
    this.initFormControls();
    this.createAreaForm = new FormGroup({
      name: this.name,
      description: this.description,
      location: this.location,
      enabled: this.enabled,
    });
  }

  initFormControls(): void {
    this.name = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.location = new FormControl('', Validators.required);
    this.enabled = new FormControl('');
  }

  onSubmit(): void {
    this.api.AdminPostArea(
      new Area(
        0,
        this.name.value,
        this.description.value,
        this.location.value,
        true
      )
    )
    .subscribe(
      (area) => {
        console.log(area);
      },
      (err) => this.errh.HandleError(err)
    );
  }
}

export class DialogData {
  name: string;
}
