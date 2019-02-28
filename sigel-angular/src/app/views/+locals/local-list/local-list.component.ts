import { Component, OnInit, ErrorHandler, ViewChild, AfterViewInit } from '@angular/core';
import { CustomDataSource } from '@app/datasources/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, ErrorHandlerService, FeedbackHandlerService, SessionService } from '@app/services/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { APILocalDataSource } from '@app/services/api-local.service';
import { LocalsFilterFormComponent } from '@app/views/+locals/locals-filter-form/locals-filter-form.component';
import { tap } from 'rxjs/operators';
import { Local, LocalFilter, Paginator, OrderBy, Area } from '@app/models/core';
import { Router } from '@angular/router';
import { CheckDeleteDialogComponent } from '@app/shared/check-delete-dialog/check-delete-dialog.component';
import { isNullOrUndefined } from 'util';
import { LocalNewDialogComponent } from '../local-new-dialog/local-new-dialog.component';

@Component({
  selector: 'app-local-list',
  templateUrl: './local-list.component.html',
  styleUrls: ['./local-list.component.scss']
})
export class LocalListComponent implements OnInit, AfterViewInit {

  datasource: CustomDataSource<Local>;
  areaNames = new Map<number, string>();
  areas: Area[] = [];

  displayedColumns = ['local'];

  @ViewChild(LocalsFilterFormComponent) filter: LocalsFilterFormComponent;
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
    this.datasource = new CustomDataSource<Local>(
      new APILocalDataSource(this.api),
      this.eh
    );
    this.count$ = this.datasource.count();
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadingInitialDataSubject.next(true);
    this.api.GetAreas(null).subscribe(
      (areas) => {
        this.areas = areas;
        for ( const a of areas ) {
          this.areaNames.set(a.ID, a.Name);
        }

        this.datasource.load(
          true,
          new LocalFilter(
            null, null, null,
            new Paginator(0, this.initialPageSize),
            null,
          ),
        );

        this.loadingInitialDataSubject.next(false);
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
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
    const lfd = this.filter.GetFilterData();

    this.datasource.load(
      loadCount,
      new LocalFilter(
        lfd.AreaID,
        lfd.Search,
        lfd.EnabledToReserve,
        new Paginator(
          this.paginator.pageIndex * this.paginator.pageSize,
          this.paginator.pageSize
        ),
        null,
      ),
    );
  }

  onShow(l: Local): void {
    this.router.navigate(['/locals', l.ID.toString(), 'profile']);
  }

  onEdit(l: Local): void {
    this.router.navigate(['/locals', l.ID.toString(), 'settings']);
  }

  onDelete(l: Local): void {
    const dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      data: {
        msg: `¿Está seguro que desea eliminar al local ${l.Name}?`,
        color: '#f44336',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !isNullOrUndefined(result) && result === true ) {
        this.api.DeleteLocal(l.ID).subscribe(
          (_) => {
            this.fh.ShowFeedback(['El local fue eliminado exitosamente']);
            this.load(true);
          },
          (e) => this.eh.HandleError(e)
        );
      }
    });
  }

  onNewLocal(): void {
    this.dialog.open(
      LocalNewDialogComponent,
      {
        data: {
          areas: this.areas,
        },
      }
    );
  }
}
