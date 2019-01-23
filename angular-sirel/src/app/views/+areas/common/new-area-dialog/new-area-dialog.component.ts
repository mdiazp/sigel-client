import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { isNullOrUndefined } from 'util';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Area } from '@app/models/area';

@Component({
  selector: 'app-new-area-dialog',
  templateUrl: './new-area-dialog.component.html',
  styleUrls: ['./new-area-dialog.component.css']
})
export class NewAreaDialogComponent implements OnInit {

  areaForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private dialog: MatDialogRef<NewAreaDialogComponent>) {}

  ngOnInit() {
    this.name = new FormControl('',
      [ Validators.required, Validators.maxLength(100)] );
    this.description = new FormControl('',
      [ Validators.required, Validators.maxLength(500) ]);
    this.location = new FormControl('',
      [ Validators.required, Validators.maxLength(500) ]);
    this.areaForm = new FormGroup({
      name: this.name,
      description : this.description,
      location : this.location,
    });
  }

  onSubmit(): void {
    this.api.PostArea(
      new Area(
        0,
        this.name.value,
        this.description.value,
        this.location.value
      )
    ).subscribe(
      (area) => {
        this.feedback.ShowFeedback('La nueva area fue creada exitosamente');
        this.dialog.close(true);
      },
      (e) => {
        this.errh.HandleError(e, 'Existe otra area con el mismo nombre');
      }
    );
  }

  validForm(): boolean {
    return (!isNullOrUndefined(this.areaForm) && this.areaForm.valid);
  }
}
