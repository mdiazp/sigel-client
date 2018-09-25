import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MatSlideToggle,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

import { ErrorHandlerService } from '@app/services/error-handler.service';
import { ApiService } from '@app/services/api.service';
import { Local } from '@app/models/local';

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
              public dialogRef: MatDialogRef<CreateLocalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogLocalData) { }

  ngOnInit() {
    this.initForm();
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
      new Local(
        0,
        Number(this.area_id.value),
        this.name.value,
        this.description.value,
        this.location.value,
        this.enabled.checked,
      )
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

export class DialogLocalData {}
