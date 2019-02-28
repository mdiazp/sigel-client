import { Component, OnInit, ErrorHandler, ViewChild, AfterViewInit } from '@angular/core';
import { CustomDataSource } from '@app/datasources/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, ErrorHandlerService, FeedbackHandlerService, SessionService } from '@app/services/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { APIAreaDataSource } from '@app/services/api-area.service';
import { AreasFilterFormComponent } from '@app/views/+areas/areas-filter-form/areas-filter-form.component';
import { tap } from 'rxjs/operators';
import { Area, AreaFilter, Paginator, OrderBy } from '@app/models/core';
import { Router } from '@angular/router';
import { CheckDeleteDialogComponent } from '@app/shared/check-delete-dialog/check-delete-dialog.component';
import { isNullOrUndefined } from 'util';
import { AreaNewDialogComponent } from '../area-new-dialog/area-new-dialog.component';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss']
})
export class AreaListComponent implements OnInit, AfterViewInit {

  datasource: CustomDataSource<Area>;
  displayedColumns = ['area'];

  @ViewChild(AreasFilterFormComponent) filter: AreasFilterFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  initialPageSize = 20;
  pageSizeOptions = [20, 50, 100];
  count$: Observable<number>;

  loadingInitialDataSubject = new BehaviorSubject<boolean>(true);
  loadingInitialData$ = this.loadingInitialDataSubject.asObservable();

  constructor(private api: ApiService,
              public session: SessionService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private dialog: MatDialog,
              private router: Router) {}

  ngOnInit() {
    this.datasource = new CustomDataSource<Area>(
      new APIAreaDataSource(this.api),
      this.eh
    );
    this.count$ = this.datasource.count();
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadingInitialDataSubject.next(true);
    this.datasource.load(
      true,
      new AreaFilter(
        null,
        new Paginator(0, this.initialPageSize),
        null,
      ),
    );
    this.loadingInitialDataSubject.next(false);
  }

  ngAfterViewInit() {
    this.filter.FilterChanges.subscribe(
      (_) => {
        this.paginator.pageIndex = 0;
        this.load(true);
      }
    );

    this.paginator.page
      .pipe(
        tap(() => this.load(false)),
      )
      .subscribe();
  }

  load(loadCount: boolean): void {
    const afd = this.filter.GetFilterData();

    this.datasource.load(
      loadCount,
      new AreaFilter(
        afd.Search,
        new Paginator(
          this.paginator.pageIndex * this.paginator.pageSize,
          this.paginator.pageSize
        ),
        null,
      ),
    );
  }

  onShow(a: Area): void {
    this.router.navigate(['/areas', a.ID.toString(), 'profile']);
  }

  onEdit(a: Area): void {
    this.router.navigate(['/areas', a.ID.toString(), 'settings']);
  }

  onDelete(a: Area): void {
    const dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      data: {
        msg: `¿Está seguro que desea eliminar el área ${a.Name}?`,
        color: '#f44336',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !isNullOrUndefined(result) && result === true ) {
        this.api.DeleteArea(a.ID).subscribe(
          (_) => {
            this.fh.ShowFeedback(['El área fue eliminado exitosamente']);
            this.load(true);
          },
          (e) => this.eh.HandleError(e)
        );
      }
    });
  }

  onNewArea(): void {
    this.dialog.open(
      AreaNewDialogComponent,
      {
        data: {},
      }
    );
  }
}
