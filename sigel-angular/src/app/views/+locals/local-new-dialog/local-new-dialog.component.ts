import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Area } from '@app/models/area';
import { Local } from '@app/models/core';
import { ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { LocalFormComponent } from '../local-form/local-form.component';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-local-new-dialog',
  templateUrl: './local-new-dialog.component.html',
  styleUrls: ['./local-new-dialog.component.css']
})
export class LocalNewDialogComponent implements OnInit {

  initialData: Local;
  areas: Area[] = [];

  @ViewChild(LocalFormComponent) form: LocalFormComponent;

  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private dialog: MatDialogRef<LocalNewDialogComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.areas = this.data.areas;
    if ( this.areas.length !== 0 ) {
      this.initialData = new Local(
        0,
        this.areas[0].ID,
        '',
        '',
        '',
        '111111111111',
        '1111111',
        8,
        30,
        17,
        0,
        false
      );
    }
  }

  ngOnInit() {
  }

  canAccept(): boolean {
    if (isNullOrUndefined(this.form)) {
      return false;
    }
    return this.form.validForm();
  }

  onAccept(): void {
    this.api.PostLocal(this.form.getData()).subscribe(
      (local) => {
        this.dialog.close(true);
        this.fh.ShowFeedback(['El nuevo local fue creado exitosamente']);
        this.router.navigate(['/locals', local.ID.toString()]);
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }
}
