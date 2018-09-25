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

import { Local } from '@app/models/local';

@Component({
  selector: 'app-edit-local-dialog',
  templateUrl: './edit-local-dialog.component.html',
  styleUrls: ['./edit-local-dialog.component.css']
})
export class EditLocalDialogComponent implements OnInit {
  editLocalForm: FormGroup;
  area_id: FormControl;
  name: FormControl;
  description: FormControl;
  location: FormControl;

  @ViewChild(MatSlideToggle) enabled: MatSlideToggle;

  constructor(public dialogRef: MatDialogRef<EditLocalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Local,
              private api: ApiService,
              private errh: ErrorHandlerService) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.initFormControls();
    this.editLocalForm = new FormGroup({
      area_id: this.area_id,
      name: this.name,
      description: this.description,
      location: this.location,
    });
  }

  initFormControls(): void {
    this.area_id = new FormControl(this.data.area_id, Validators.required);
    this.name = new FormControl(this.data.name, Validators.required);
    this.description = new FormControl(this.data.description, Validators.required);
    this.location = new FormControl(this.data.location, Validators.required);
  }

  onSubmit(): void {
    this.api.AdminPatchLocal(
      new Local(
        this.data.id,
        Number(this.area_id.value),
        this.name.value,
        this.description.value,
        this.location.value,
        this.enabled.checked,
      )
    )
    .subscribe(
      (local) => {
        console.log(local);
        this.dialogRef.close();
      },
      (err) => this.errh.HandleError(err)
    );
  }
}
