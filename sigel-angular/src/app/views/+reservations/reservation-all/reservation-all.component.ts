import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatSelect } from '@angular/material';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent, Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';

import {
  CheckDeleteDialogComponent
} from '@app/shared/check-delete-dialog/check-delete-dialog.component';

import {
  ErrorHandlerService,
  FeedbackHandlerService,
  ApiService,
} from '@app/services/core';
import {
  Reservation, ReservationFilter, Paginator, OrderBy, Local
} from '@app/models/core';
import { isNullOrUndefined } from 'util';
import { CustomDataSource } from '@app/datasources/core';
import { APIReservationDataSource } from '@app/services/api-reservation.service';
import { ReservationsFilterComponent } from '@app/views/+reservations/common/reservations-filter/reservations-filter.component';
import {
  PublicReservationDetailsDialogComponent
} from '@app/views/+public-reservations/public-reservation-details-dialog/public-reservation-details-dialog.component';

@Component({
  selector: 'app-reservation-all',
  templateUrl: './reservation-all.component.html',
  styleUrls: ['./reservation-all.component.scss']
})
export class ReservationAllComponent implements OnInit, AfterViewInit {

  datasource: CustomDataSource<Reservation>;
  displayedColumns = ['reservation'];

  @ViewChild(ReservationsFilterComponent) filter: ReservationsFilterComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  initialPageSize = 20;
  pageSizeOptions = [20, 50, 100];
  count$: Observable<number>;

  localNames = new Map<number, string>();

  loadingInitialDataSubject = new BehaviorSubject<boolean>(false);
  loadingInitialData$ = this.loadingInitialDataSubject.asObservable();

  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.datasource = new CustomDataSource<Reservation>(
      new APIReservationDataSource(this.api),
      this.eh
    );
    this.count$ = this.datasource.count();

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadingInitialDataSubject.next(true);
    this.api.GetLocals(null).subscribe(
      (locals) => {
        for ( const l of locals ) {
          this.localNames.set(l.ID, l.Name);
        }

        this.datasource.load(
          true,
          new ReservationFilter(
            null, null, null, null, null, null,
            new Paginator(0, this.initialPageSize),
            new OrderBy('begin_time', true),
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

  onShowReservation(r: Reservation): void {
    this.dialog.open(
      PublicReservationDetailsDialogComponent,
      {
        data: {
          reservation: r,
          showUser: true,
          showActivityDescription: true,
          showStatus: false,
          showTimes: false,
          showActivityName: false,
          showConfirmationStatus: false,
        }
      }
    );
  }

  onAcceptReservation(r: Reservation): void {
    const dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      data: {
        msg: `Está seguro que desea aceptar la reservación para la actividad ${r.ActivityName}?`,
        color: 'green',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !isNullOrUndefined(result) && result === true ) {
        this.api.AcceptReservation(r.ID).subscribe(
          (_) => {
            this.fh.ShowFeedback(['La reservación fue aceptada correctamente']);
            this.load(true);
          },
          (e) => this.eh.HandleError(e)
        );
      }
    });
  }

  onRefuseReservation(r: Reservation): void {
    const dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      data: {
        msg: `Está seguro que desea denegar la reservación para la actividad ${r.ActivityName}?`,
        color: '#f44336',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !isNullOrUndefined(result) && result === true ) {
        this.api.RefuseReservation(r.ID).subscribe(
          (_) => {
            this.fh.ShowFeedback(['La reservación fue denegada correctamente']);
            this.load(true);
          },
          (e) => this.eh.HandleError(e)
        );
      }
    });
  }

  load(loadCount: boolean) {
    const rd = this.filter.GetFilterData();

    this.datasource.load(
      loadCount,
      new ReservationFilter(
        rd.UserID,
        rd.LocalID,
        rd.Date,
        null,
        null,
        null,
        new Paginator(
          this.paginator.pageIndex * this.paginator.pageSize,
          this.paginator.pageSize
        ),
        new OrderBy(
          'begin_time',
          true,
        ),
      ),
    );
  }
}
