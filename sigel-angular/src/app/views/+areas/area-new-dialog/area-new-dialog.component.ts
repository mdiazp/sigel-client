import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Area } from '@app/models/area';
import { ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { AreaFormComponent } from '../area-form/area-form.component';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-area-new-dialog',
  templateUrl: './area-new-dialog.component.html',
  styleUrls: ['./area-new-dialog.component.css']
})
export class AreaNewDialogComponent implements OnInit {

  initialData: Area;

  @ViewChild(AreaFormComponent) form: AreaFormComponent;

  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private dialog: MatDialogRef<AreaNewDialogComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initialData = new Area(
      0,
      '',
      '',
      ''
    );
  }

  ngOnInit(): void {
  }

  canAccept(): boolean {
    if (isNullOrUndefined(this.form)) {
      return false;
    }
    return !this.form.areaForm.invalid;
  }

  onAccept(): void {
    this.api.PostArea(this.form.getData()).subscribe(
      (area) => {
        this.dialog.close(true);
        this.fh.ShowFeedback(['La nueva área fue creada exitosamente']);
        this.router.navigate(['/areas', area.ID.toString()]);
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }
}
