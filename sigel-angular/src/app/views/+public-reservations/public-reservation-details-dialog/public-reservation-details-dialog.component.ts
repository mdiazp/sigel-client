import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Reservation, Util } from '@app/models/core';

@Component({
  selector: 'app-public-reservation-details-dialog',
  templateUrl: './public-reservation-details-dialog.component.html',
  styleUrls: ['./public-reservation-details-dialog.component.scss']
})
export class PublicReservationDetailsDialogComponent implements OnInit {

  reservation: Reservation;
  util = new Util();

  constructor(public dialogRef: MatDialogRef<PublicReservationDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reservation = data.reservation;
  }

  ngOnInit() {
  }

  timeToShowt(t: string): string {
    return this.util.StrTimeToDisplayValue(t);
  }
}
