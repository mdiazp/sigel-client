import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService, SessionService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { PublicReservationFilterComponent } from '@app/views/+reservations/public-reservation-filter/public-reservation-filter.component';
import { ReservationFilter, PagAndOrderFilter, Reservation, Util, Local, WorkingTimeUtil } from '@app/models/core';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material';
import { PublicReserveDialogComponent } from '@app/views/+reservations/public-reserve-dialog/public-reserve-dialog.component';

@Component({
  selector: 'app-public-reservation-all',
  templateUrl: './public-reservation-all.component.html',
  styleUrls: ['./public-reservation-all.component.css']
})
export class PublicReservationAllComponent implements OnInit, AfterViewInit {

  @ViewChild(PublicReservationFilterComponent) filter: PublicReservationFilterComponent;

  reservations: Reservation[] = [];
  serverTime = new Date(Date.now());

  // For fill column 'local'
  localNames = new Map<number, string>();
  local: Local = null;
  util = new Util();

  workingTimeUtil = new WorkingTimeUtil();

  filterReady = false;

  information = '';

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService,
              private dialog: MatDialog,
              private feedback: FeedbackHandlerService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.filter.Ready.subscribe(
      (ready) => {
        if ( ready ) {
          this.fillLocalNames();
          this.LoadData();
          this.filter.FilterChanges.subscribe(
            (filterData) => {
              this.LoadData();
            }
          );
          this.filterReady = true;
        }
      }
    );
  }

  canConfirm(reservation: Reservation): boolean {
    let bt: Date; bt = this.util.StrtoDate(reservation.BeginTime);
    bt.setDate(bt.getDate() - 1);
    // Check confirm one day before
    if ( reservation.Confirmed ||
         (
          this.serverTime.getFullYear() !== bt.getFullYear() ||
          this.serverTime.getMonth() !== bt.getMonth() ||
          this.serverTime.getDate() !== bt.getDate()
         )
        ) {
        return false;
    }

    return (this.session.getModeValue() === 'public') &&
           (this.session.getUserID() === reservation.UserID);
  }

  onConfirm(reservation: Reservation): void {
    this.api.ConfirmReservation(reservation.ID).subscribe(
      (r) => {
        this.feedback.ShowFeedback('La reservacion fue confirmada correctamente');
        this.LoadData();
      },
      (e) => {
        this.errh.HandleError(e);
      }
    );
  }

  fillLocalNames(): void {
    for ( let i = 0; i < this.filter.locals.length; i++ ) {
      this.localNames[ this.filter.locals[i].ID ] = this.filter.locals[i].Name;
    }
  }

  LoadData(): void {
    this.loadServerTime();
  }

  loadServerTime(): void {
    this.api.GetServerTime().subscribe(
      (serverTime) => {
        this.serverTime = serverTime;
        this.loadLocal();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadLocal(): void {
    const filterData = this.filter.GetFilterData();
    this.api.GetLocal(filterData.LocalID, 'public').subscribe(
      (local) => {
        this.local = local;
        this.loadReservations();
      },
      (e) => {
        this.errh.HandleError(e);
      }
    );
  }

  loadReservations(): void {
    const filterData = this.filter.GetFilterData();
    console.log(filterData.Date);
    const f = new ReservationFilter(
      null,
      filterData.LocalID,
      filterData.Date,
      null,
      null,
      null,
      new PagAndOrderFilter(1000, 0, 'begin_time', false)
    );

    this.api.GetReservations(f, this.session.getModeValue()).subscribe(
      (reservations) => {
        this.reservations = reservations;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  canReserve(): boolean {
    this.information = '';

    if ( !this.filterReady || isNullOrUndefined(this.local) ) {
      return false;
    }

    let show: boolean = (this.session.getModeValue() === 'public' &&
                         this.session.getUsername() !== 'SIREL' &&
                         !this.PastDate());

    if (this.PastDate) {
      this.information = 'Todas la reservaciones necesitan un dia de antelacion';
    }

    if (!this.workingTimeUtil.IsWorking(
          this.filter.selectDate.value,
          this.local.WorkingMonths,
          this.local.WorkingWeekDays
        ) ) {
      this.information = 'No laborable';
    }

    show = (show &&
            this.workingTimeUtil.IsWorking(
              this.filter.selectDate.value,
              this.local.WorkingMonths,
              this.local.WorkingWeekDays
            )
           );

    return show;
  }

  PastDate(): boolean {
    const st = this.util.DatetoStr(this.filter.servertime);
    const df = this.util.DatetoStr(this.filter.selectDate.value);

    if ( !st || st === null || !df || df === null ) {
      return false;
    }

    return this.util.before(df, st) || !this.util.before(st, df);
  }

  onReserve(): void {
    const ref = this.dialog.open(
      PublicReserveDialogComponent,
      {
        data: {
          local: this.local,
          reservations: this.reservations,
          date: this.filter.GetFilterData().Date,
        }
      },
    );

    ref.afterClosed().subscribe(result => {
      if ( !isNullOrUndefined(result) && result ) {
        this.LoadData();
      }
    });
  }
}
