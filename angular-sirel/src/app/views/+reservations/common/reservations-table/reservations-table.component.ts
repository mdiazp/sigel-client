import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import {
  ReservationsFilterComponent,
  ReservationsFilterData,
} from '@app/views/+reservations/common/reservations-filter/reservations-filter.component';
import { ApiService, SessionService, ErrorHandlerService } from '@app/services/core';
import { ReservationFilter, Reservation, PagAndOrderFilter } from '@app/models/core';

@Component({
  selector: 'app-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.css']
})
export class ReservationsTableComponent implements OnInit, AfterViewInit {

  @Input() mode = 'public';
  @Input() displayedColumns =
  ['name', 'local', 'date', 'status', 'operations'];
  dataSource = new MatTableDataSource();

  @ViewChild(ReservationsFilterComponent) filter: ReservationsFilterComponent;
  filterData: ReservationsFilterData = new ReservationsFilterData(null, null, null);

  // For fill column 'local'
  localNames = new Map<number, string>();

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) {}

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.filter.Ready.subscribe(
      (ready) => {
        if ( ready ) {
          this.fillLocalNames();
          this.loadReservations();
        }
      }
    );
  }

  onRefuseClick(reservation: Reservation): void {
    this.api.RefuseReservation(reservation.ID).subscribe(
      (data) => {
        alert(`The reservation with ID(${reservation.ID}) has been deleted`);
        this.loadReservations();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  onAcceptClick(reservation: Reservation): void {
    console.log('onAcceptClick');
    this.api.AcceptReservation(reservation.ID).subscribe(
      (data) => {
        this.loadReservations();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  onFilter(filterData: ReservationsFilterData): void {
    this.filterData = filterData;
    this.loadReservations();
  }
/*
  loadLocals(): void {
    this.api.GetLocals(null, this.mode).subscribe(
      (locals) => {
        this.locals = locals;
        this.fillLocalNames();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
*/
  fillLocalNames(): void {
    for ( let i = 0; i < this.filter.locals.length; i++ ) {
      this.localNames[ this.filter.locals[i].ID ] = this.filter.locals[i].Name;
      // console.log(this.locals[i].ID.toString() + ' => ' + this.locals[i].Name);
    }
  }

  loadReservations(): void {
    const f = new ReservationFilter(
      this.filterData.UserID,
      this.filterData.LocalID,
      this.filterData.Date,
      null,
      null,
      null,
      new PagAndOrderFilter(20, 0, 'begin_time', true)
    );

    this.api.GetReservations(f, this.session.getModeValue()).subscribe(
      (reservations) => {
        this.dataSource.data = reservations;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
