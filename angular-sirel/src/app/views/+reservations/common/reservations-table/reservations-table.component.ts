import {
  Component, OnInit, Input,
  ViewChild, AfterViewInit, Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import {
  ReservationsFilterComponent,
} from '@app/views/+reservations/common/reservations-filter/reservations-filter.component';
import { ApiService, SessionService, ErrorHandlerService } from '@app/services/core';
import { ReservationFilter, Reservation, PagAndOrderFilter, Util } from '@app/models/core';

@Component({
  selector: 'app-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.css']
})
export class ReservationsTableComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource();
  reservations: Reservation[] = [];
  serverTime = new Date(Date.now());

  @Input() filter: ReservationsFilterComponent;
  @Output() ConfirmClick = new EventEmitter<Reservation>();
  @Output() AcceptClick = new EventEmitter<Reservation>();
  @Output() RefuseClick = new EventEmitter<Reservation>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // For fill column 'local'
  localNames = new Map<number, string>();

  util = new Util();

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) {}

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
        }
      }
    );

    this.dataSource.paginator = this.paginator;
  }

  GetDisplayedColumns(): string[] {
    if ( this.session.getModeValue() === 'public' ) {
      return ['name', 'local', 'date', 'status'];
    } else {
      return ['name', 'local', 'date', 'status', 'operations'];
    }
  }

  canConfirm(reservation: Reservation): boolean {
    let bt: Date; bt = this.util.StrtoDate(reservation.BeginTime);
    bt.setDate(bt.getDate() - 1);
    // Check confirm one day before
    if ( !reservation.Confirmed &&
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
        this.loadReservations();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadReservations(): void {
    const filterData = this.filter.GetFilterData();
    console.log(filterData.Date);
    const f = new ReservationFilter(
      filterData.UserID,
      filterData.LocalID,
      filterData.Date,
      null,
      null,
      null,
      new PagAndOrderFilter(20, 0, 'begin_time', true)
    );

    this.api.GetReservations(f, this.session.getModeValue()).subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.dataSource.data = this.reservations;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
