import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Local, Reservation, ReservationFilter, PagAndOrderFilter, Util } from '@app/models/core';
import { ApiService, ErrorHandlerService, SessionService, FeedbackHandlerService } from '@app/services/core';
import { BehaviorSubject, config } from 'rxjs';
import { MatDialog } from '@angular/material';
import {
  PublicReserveDialogComponent
} from '@app/views/+public-reservations/public-reserve-dialog/public-reserve-dialog.component';
import {
  PublicReservationDetailsDialogComponent
} from '@app/views/+public-reservations/public-reservation-details-dialog/public-reservation-details-dialog.component';

@Component({
  selector: 'app-public-reservations-of-day',
  templateUrl: './public-reservations-of-day.component.html',
  styleUrls: ['./public-reservations-of-day.component.scss']
})
export class PublicReservationsOfDayComponent implements OnInit {

  util = new Util();

  @Input() local: Local = null;
  @Input() date: Date = new Date();
  @Input() reservations: Reservation[] = [];
  @Output() AddReservationChange = new EventEmitter<boolean>();
  @Output() ClickOnDate = new EventEmitter<boolean>();

  asps: ActivityStatusPanel[] = [];
  hps: HourPanel[] = [];

  now: Date = new Date();

  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private session: SessionService,
              private dialog: MatDialog) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.refresh();
  }

  public dateToShow(): string {
    return this.util.DateToDisplayValue(this.date);
  }

  public refresh(): void {
    this.updateASPS();
    this.updateHPS();
  }

  public updateASPS(): void {
    const asps = new Array<ActivityStatusPanel>();

    const bt = new HM(
      this.local.WorkingBeginTimeHours,
      this.local.WorkingBeginTimeMinutes
    );
    const et = new HM(
      this.local.WorkingEndTimeHours,
      this.local.WorkingEndTimeMinutes
    );

    let t = bt;

    for ( let i = 0; i < this.reservations.length; i++ ) {
      const res = this.reservations[i];
      const l = max(
        new HM(this.util.getHours(res.BeginTime),
               this.util.getMinutes(res.BeginTime)),
        bt
      );
      const r = min(
        new HM(this.util.getHours(res.EndTime),
               this.util.getMinutes(res.EndTime)),
        et
      );

      if ( l.gt(t) ) {
        const aux = l; aux.rest1m();
        asps.push(new ActivityStatusPanel(
          l.rest(t) + 1,
          'free',
          t.rest(bt) + 1,
          null,
          t,
          aux,
        ));
      }

      asps.push(new ActivityStatusPanel(
        r.rest(l) + 1,
        ( res.Pending ? 'pending' : 'accepted' ),
        l.rest(bt) + 1,
        res,
        l,
        r,
      ));

      t = r;
      t.add1m();
    }

    if ( t.le(et) ) {
      asps.push(new ActivityStatusPanel(
        et.rest(t) + 1,
        'free',
        t.rest(bt) + 1,
        null,
        t,
        et,
      ));
    }

    this.asps = asps;
  }

  public updateHPS(): void {
    let t = new HM(
      this.local.WorkingBeginTimeHours,
      this.local.WorkingBeginTimeMinutes,
    );
    const et = new HM(
      this.local.WorkingEndTimeHours,
      this.local.WorkingEndTimeMinutes,
    );

    const hps = new Array<HourPanel>();

    while ( t.le(et) ) {
      const l = t;
      const r = min(new HM(l.h + 1, 0), et);
      const hp = new HourPanel( l, r.rest(l) );

      t = r;

      hps.push(hp);

      if ( !t.le(et) ) {
        const tmp = new HourPanel( et, 60 );
        tmp.isLast = true;
        hps.push(tmp);
      }
    }

    this.hps = hps;
  }

  clickOnActivityStatusPanel(asp: ActivityStatusPanel): void {
    if ( asp.status === 'free' ) {
      if (asp.et.rest(asp.bt) + 1 < 30) {
        return;
      }

      const ref = this.dialog.open(
        PublicReserveDialogComponent,
        {
          data: {
            date: this.date,
            local: this.local,
            reservations: this.reservations,
            bt: asp.bt,
            et: asp.et,
          },
        }
      );
      ref.afterClosed().subscribe(
        (ok) => {
          if (ok) {
            this.AddReservationChange.emit(true);
          }
        }
      );
    } else {
      this.dialog.open(
        PublicReservationDetailsDialogComponent,
        {
          data: {
            reservation: asp.r
          },
        }
      );
    }
  }
}

export class HM {
  constructor(public h: number,
              public m: number) {}

  le(o: HM): boolean {
    if ( this.h !== o.h ) {
      return this.h < o.h;
    }
    return this.m < o.m;
  }
  rq(o: HM): boolean {
    return !this.le(o) && !o.le(this);
  }
  gt(o: HM): boolean {
    return o.le(this);
  }

  rest(o: HM): number {
    return this.tom() - o.tom();
  }

  tom(): number {
    return this.h * 60 + this.m;
  }

  add1m(): void {
    this.m++;
    if ( this.m === 60 ) {
      this.m = 0;
      this.h++;
    }
    if ( this.h === 24 ) {
      this.h = 0;
    }
  }

  rest1m(): void {
    this.m--;
    if ( this.m === -1 ) {
      this.m = 59;
      this.h--;
    }
    if ( this.h === -1 ) {
      this.h = 23;
    }
  }

  toString(): string {
    return (this.h < 10 ? '0' : '') + this.h.toString() + ':' +
           (this.m < 10 ? '0' : '') + this.m.toString();
  }
}

export function max(a: HM, b: HM): HM {
  if ( a.gt(b) ) {
    return a;
  }
  return b;
}

export function min(a: HM, b: HM): HM {
  if ( a.gt(b) ) {
    return b;
  }
  return a;
}

export class HourPanel {
  isLast = false;
  constructor(public t: HM,
              public height: number,
              ) {}
}

export class ActivityStatusPanel {
  constructor(public height: number,
              public status: string,
              public top: number,
              public r: Reservation,
              public bt: HM,
              public et: HM) {}
}
