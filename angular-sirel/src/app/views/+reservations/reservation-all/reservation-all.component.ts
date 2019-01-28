import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import {
  ReservationsTableComponent,
} from '@app/views/+reservations/common/reservations-table/reservations-table.component';
import {
  ReservationsFilterComponent,
} from '@app/views/+reservations/common/reservations-filter/reservations-filter.component';
import {
  ReservationFormComponent,
} from '@app/views/+reservations/common/reservation-form/reservation-form.component';


import {
  ApiService,
  ErrorHandlerService,
  SessionService,
  FeedbackHandlerService,
} from '@app/services/core';

import {
  Reservation,
  Local,
  ReservationToCreate,
  Util,
} from '@app/models/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-reservation-all',
  templateUrl: './reservation-all.component.html',
  styleUrls: ['./reservation-all.component.css']
})
export class ReservationAllComponent implements OnInit, AfterViewInit {

  @ViewChild(ReservationsTableComponent) table: ReservationsTableComponent;
  @ViewChild(ReservationsFilterComponent) filter: ReservationsFilterComponent;
  @ViewChild(ReservationFormComponent) reserve: ReservationFormComponent;

  util = new Util();



  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService) {
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log(this.filter.);
  }

  public showReserveForm(): boolean {
    const show = (this.session.getModeValue() === 'public' &&
                  this.session.getUsername() !== 'SIREL' &&
                  !this.PastDate());
    return show;
  }

  CreateReservation(rtc: ReservationToCreate) {
    if (!this.validateNewReservation(rtc)) {
      return;
    }

    this.api.PostReservation(rtc).subscribe(
      (r) => {
        this.table.LoadData();
        if (!r.Confirmed) {
          this.feedback.ShowFeedback(
            [
              'Su reservacion esta pendiente de revision.',
              'La reservacion necesita de su confirmacion un dia antes'
            ]
          );
        } else {
          this.feedback.ShowFeedback(['Su reservacion esta pendiente de revision.']);
        }
        if ( this.reserve ) {
          this.reserve.Reset();
        }
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  AcceptReservation(reservation: Reservation): void {
    this.api.AcceptReservation(reservation.ID).subscribe(
      (data) => {
        this.feedback.ShowFeedback([`La reservacion fue aceptada`]);
        this.table.LoadData();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  RefuseReservation(reservation: Reservation): void {
    this.api.RefuseReservation(reservation.ID).subscribe(
      (data) => {
        this.feedback.ShowFeedback([`La reservacion fue eliminada`]);
        this.table.LoadData();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  ConfirmReservation(reservation: Reservation): void {
    this.api.ConfirmReservation(reservation.ID).subscribe(
      (data) => {
        this.feedback.ShowFeedback([`La reservacion fue confirmada`]);
        this.table.LoadData();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  PastDate(): boolean {
    const st = this.util.DatetoStr(this.filter.servertime);
    const df = this.util.DatetoStr(this.filter.selectDate.value);

    // console.log('st = ', st);
    // console.log('df = ', df);

    if ( !st || st === null || !df || df === null ) {
      return false;
    }

    return this.util.before(df, st) || !this.util.before(st, df);
  }

  validateNewReservation(rtc: ReservationToCreate): boolean {
    const bh = this.gh(rtc.BeginTime);
    const bm = this.gm(rtc.BeginTime);
    const eh = this.gh(rtc.EndTime);
    const em = this.gm(rtc.EndTime);

    if ( bh > eh ||
        (bh === eh && bm > em) ) {
      this.reserve.error = 'La hora del inicio no puede ser mayor que la hora del fin';
      return;
    }

    const localbh = this.reserve.local.WorkingBeginTimeHours;
    const localbm = this.reserve.local.WorkingBeginTimeMinutes;
    const localeh = this.reserve.local.WorkingEndTimeHours;
    const localem = this.reserve.local.WorkingEndTimeMinutes;

    if ( bh < localbh || (bh === localbh && bm < localbm) ) {
      this.reserve.error = 'La hora del inicio no esta dentro del horario laboral';
      return;
    }

    if ( eh > localeh || (eh === localeh && em > localem) ) {
      this.reserve.error = 'La hora del fin no esta dentro del horario laboral';
      return;
    }

    // Validate that not exists any conflict with others reservations
    for (let i = 0; i < this.table.reservations.length; i++) {
      const xbh = this.gh(this.table.reservations[i].BeginTime);
      const xbm = this.gm(this.table.reservations[i].BeginTime);
      const xeh = this.gh(this.table.reservations[i].EndTime);
      const xem = this.gm(this.table.reservations[i].EndTime);

      if ( eh < xbh || (eh === xbh && em < xbm) ||
           bh > xeh || (bh === xeh && bm > xem) ) {
        continue;
      }

      this.reserve.error = 'Existe conflicto en el horario con otras reservaciones';
      return false;
    }
    return true;
  }

  // 01234567890123456789
  // yyyy-mm-ddThh:mm:ssZ
  private gh(s: string): number {
    return this.util.getHours(s);
    // return Number(s[11]) * 10 + Number(s[12]);
  }
  private gm(s: string): number {
    return this.util.getMinutes(s);
    // return Number(s[14]) * 10 + Number(s[15]);
  }
}
