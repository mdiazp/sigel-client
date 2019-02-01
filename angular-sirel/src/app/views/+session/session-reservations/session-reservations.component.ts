import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Reservation, Util } from '@app/models/core';

@Component({
  selector: 'app-session-reservations',
  templateUrl: './session-reservations.component.html',
  styleUrls: ['./session-reservations.component.scss']
})
export class SessionReservationsComponent implements OnInit {

  @Input() commingReservations: Reservation[];
  @Input() serverTime: Date;
  @Output() ConfirmEvent = new EventEmitter<Reservation>();

  util = new Util();

  constructor() { }

  ngOnInit() {
    console.log('this.commingReservations.length = ', this.commingReservations.length);
  }

  canConfirm(reservation: Reservation): boolean {
    // Check confirm one day before
    const bt = this.util.StrtoDate(reservation.BeginTime);
    bt.setDate(bt.getDate() - 1);

    if ( reservation.Confirmed ||
         (
          this.serverTime.getFullYear() !== bt.getFullYear() ||
          this.serverTime.getMonth() !== bt.getMonth() ||
          this.serverTime.getDate() !== bt.getDate()
         )
        ) {
        return false;
    }

    return true;
  }
}
