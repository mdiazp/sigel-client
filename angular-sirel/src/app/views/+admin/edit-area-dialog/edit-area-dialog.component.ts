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
  selector: 'app-edit-area-dialog',
  templateUrl: './edit-area-dialog.component.html',
  styleUrls: ['./edit-area-dialog.component.css']
})
export class EditAreaDialogComponent implements OnInit {
  editAreaForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;

  @ViewChild(MatSlideToggle) enabled: MatSlideToggle;

  constructor(public dialogRef: MatDialogRef<EditAreaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Area,
              private api: ApiService,
              private errh: ErrorHandlerService) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.initFormControls();
    this.editAreaForm = new FormGroup({
      name: this.name,
      description: this.description,
      location: this.location,
    });
  }

  initFormControls(): void {
    this.name = new FormControl(this.data.name, Validators.required);
    this.description = new FormControl(this.data.description, Validators.required);
    this.location = new FormControl(this.data.location, Validators.required);
  }

  onSubmit(): void {
    this.api.AdminPatchArea(
      new Area(
        this.data.id,
        this.name.value,
        this.description.value,
        this.location.value,
        this.enabled.checked,
      )
    )
    .subscribe(
      (area) => {
        console.log(area);
        this.dialogRef.close();
      },
      (err) => this.errh.HandleError(err)
    );
  }
}
