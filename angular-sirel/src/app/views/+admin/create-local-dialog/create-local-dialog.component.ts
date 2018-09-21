import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MatSlideToggle,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

import { ErrorHandlerService } from '@app/services/error-handler.service';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-create-local-dialog',
  templateUrl: './create-local-dialog.component.html',
  styleUrls: ['./create-local-dialog.component.css']
})
export class CreateLocalDialogComponent implements OnInit {

  createLocalForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;
  area_id: FormControl;
  @ViewChild(MatSlideToggle) enabled: MatSlideToggle;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              public dialogRef: MatDialogRef<CreateLocalDialogComponent>) { }

  ngOnInit() {

  }

  initForm() {
    this.initFormControls();
    this.createLocalForm = new FormGroup({
      area_id: this.area_id,
      name: this.name,
      description : this.description,
      location : this.location,
    });
  }

  initFormControls() {
    this.name = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.location = new FormControl('', Validators.required);
    this.area_id = new FormControl('', Validators.required);
  }

  onSubmit() {
    this.api.AdminPostLocal(
      {
        id: 0,
        name: this.name.value,
        description: this.description.value,
        location: this.location.value,
        enable_to_reserve: this.enabled.checked,
        area_id: this.area_id.value
      }
    )
    .subscribe(
      (data) => {
        console.log(data);
        this.dialogRef.close();
      },
      (err) => this.errh.HandleError(err)
    );
  }
}
