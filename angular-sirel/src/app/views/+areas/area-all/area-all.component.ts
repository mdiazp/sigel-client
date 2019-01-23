import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { AreaFormComponent } from '@app/views/+areas/common/area-form/area-form.component';
import { AreasTableComponent } from '@app/views/+areas/common/areas-table/areas-table.component';
import { ApiService, ErrorHandlerService, SessionService, FeedbackHandlerService } from '@app/services/core';
import { Area } from '@app/models/core';
import { MatInput, MatDialog } from '@angular/material';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NewAreaDialogComponent } from '@app/views/+areas/common/new-area-dialog/new-area-dialog.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-area-all',
  templateUrl: './area-all.component.html',
  styleUrls: ['./area-all.component.css']
})
export class AreaAllComponent implements OnInit, AfterViewInit {

  @ViewChild(AreasTableComponent) areas: AreasTableComponent;
  @ViewChild(AreaFormComponent) createForm: AreaFormComponent;
  @ViewChild('nameFilter') filter: ElementRef;

  expandCreateArea = false;

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
              this.areas.FilterByName(this.filter.nativeElement.value);
          })
      )
      .subscribe();
  }

  onNew(): void {
    this.dialog.open(NewAreaDialogComponent).afterClosed().subscribe(
      (result) => {
        if ( !isNullOrUndefined(result) && result ) {
          this.areas.FilterByName(this.filter.nativeElement.value);
        }
      },
    );
  }

  CreateArea(area: Area) {
    this.api.PostArea(area).subscribe(
      (data) => {
        this.createForm.reset();
        this.areas.LoadAreas();
        this.feedback.ShowFeedback('El area fue creada correctamente');
        this.expandCreateArea = false;
      },
      (err) => {
        this.errh.HandleError(err, 'Existe otra area con el mismo nombre');
      }
    );
  }

  onOpenCreateArea(): void {
    this.expandCreateArea = true;
  }
}
