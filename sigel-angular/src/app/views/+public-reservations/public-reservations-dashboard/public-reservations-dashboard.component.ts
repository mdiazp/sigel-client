import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  ApiService,
  SessionService,
  ErrorHandlerService,
  FeedbackHandlerService,
} from '@app/services/core';
import {
  Local,
  Area,
  Reservation,
  ReservationFilter,
  PagAndOrderFilter,
  Util,
} from '@app/models/core';
import {
  PublicReservationsOfDayComponent
} from '@app/views/+public-reservations/public-reservations-of-day/public-reservations-of-day.component';
import { async } from '@angular/core/testing';
import { MatTab, MatTabGroup, MatCalendar, MatDialog } from '@angular/material';
import {
  PublicLocalDetailsDialogComponent
} from '@app/views/+public-reservations/public-local-details-dialog/public-local-details-dialog.component';

@Component({
  selector: 'app-public-reservations-dashboard',
  templateUrl: './public-reservations-dashboard.component.html',
  styleUrls: ['./public-reservations-dashboard.component.scss']
})
export class PublicReservationsDashboardComponent implements OnInit {

  util = new Util();

  localFilterOptions: AreaOption[] = [];
  areas: Area[] = [];
  locals: Local[] = [];
  readySubjectLocalFilter = new BehaviorSubject<boolean>(false);
  readyLocalFilter = this.readySubjectLocalFilter.asObservable();

  serverTime: Date;
  readySubjectServerTime = new BehaviorSubject<boolean>(false);
  readyServerTime = this.readySubjectServerTime.asObservable();

  reservations: Reservation[] = [];
  readySubjectReservations = new BehaviorSubject<boolean>(false);
  readyReservations = this.readySubjectReservations.asObservable();

  selectedLocal: Local = null;
  selectedDate: Date = null;

  @ViewChild(MatTabGroup) tabs: MatTabGroup;

  constructor(private api: ApiService,
              private session: SessionService,
              private eh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.readyLocalFilter.subscribe(
      (ok) => {
        if (ok) {
          this.filterChange();
        }
      }
    );

    this.readyServerTime.subscribe(
      (ok) => {
        if (ok) {
          this.filterChange();
        }
      }
    );

    this.loadLocalFilterData();
    this.loadServerTime();
  }

  filterChange(): void {
    if ( this.selectedLocal !== null && this.selectedDate !== null ) {
      this.loadReservations();
    }
  }

  onSelectDate(date: Date): void {
    this.selectedDate = date;
    this.filterChange();
    this.tabs.selectedIndex = 1;
  }

  showLocalDetails(): void {
    this.dialog.open(
      PublicLocalDetailsDialogComponent,
      {
        data: {
          local: this.selectedLocal
        }
      }
    );
  }

  loadLocalFilterData(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    this.api.GetAreas(null, this.session.getModeValue()).subscribe(
      (areas) => {
        this.areas = areas;
        this.loadLocals();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  loadLocals(): void {
    this.api.GetLocals(null, this.session.getModeValue()).subscribe(
      (locals) => {
        this.locals = locals;
        this.fillLocalFilterOptions();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  fillLocalFilterOptions(): void {
    const options = new Map<number, AreaOption>();
    for ( const area of this.areas ) {
      options.set(area.ID, new AreaOption(area.Name, new Array<Local>()));
    }
    for ( const local of this.locals ) {
      options.get(local.AreaID).locals.push(local);
    }

    options.forEach(
      (ao, _) => {
        this.localFilterOptions.push(ao);
      }
    );

    if ( this.locals.length > 0 ) {
      this.selectedLocal = this.locals[0];
    }

    this.readySubjectLocalFilter.next(true);
  }

  loadServerTime(): void {
    this.api.GetServerTime().subscribe(
      (serverTime) => {
        this.serverTime = serverTime;
        this.selectedDate = this.serverTime;
        this.readySubjectServerTime.next(true);
      },
      (e) => {
        this.eh.HandleError(e);
        this.readySubjectServerTime.next(true);
      }
    );
  }

  private loadReservations(): void {
    this.readySubjectReservations.next(false);
    this.api.GetReservations(
      new ReservationFilter(
        null,
        this.selectedLocal.ID,
        this.util.DatetoStr(this.selectedDate).slice(0, 10),
        null,
        null,
        null,
        new PagAndOrderFilter(null, 0, 'begin_time', false)
      ),
      this.session.getModeValue()
    ).subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.readySubjectReservations.next(true);
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }
}

export class AreaOption {
  constructor(public areaName: string,
              public locals: Local[]) {}
}
