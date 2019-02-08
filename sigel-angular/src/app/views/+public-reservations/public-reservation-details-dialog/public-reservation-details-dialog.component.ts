import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Reservation, Util } from '@app/models/core';
import { isNullOrUndefined } from 'util';
import { ApiService, ErrorHandlerService } from '@app/services/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-public-reservation-details-dialog',
  templateUrl: './public-reservation-details-dialog.component.html',
  styleUrls: ['./public-reservation-details-dialog.component.scss']
})
export class PublicReservationDetailsDialogComponent implements OnInit {

  reservation: Reservation;
  util = new Util();

  username = '';
  showStatus = true;
  showTimes = true;
  showActivityName = true;
  showActivityDescription = true;
  showUser = false;
  showConfirmationStatus = false;

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(public api: ApiService,
              public eh: ErrorHandlerService,
              public dialogRef: MatDialogRef<PublicReservationDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.reservation = data.reservation;

    if ( !isNullOrUndefined(data.showStatus) ) {
      this.showStatus = data.showStatus;
    }
    if ( !isNullOrUndefined(data.showTimes) ) {
      this.showTimes = data.showTimes;
    }
    if ( !isNullOrUndefined(data.showActivityName) ) {
      this.showActivityName = data.showActivityName;
    }
    if ( !isNullOrUndefined(data.showActivityDescription) ) {
      this.showActivityDescription = data.showActivityDescription;
    }
    if ( !isNullOrUndefined(data.showUser) ) {
      this.showUser = data.showUser;
    }
    if ( !isNullOrUndefined(data.showConfirmationStatus) ) {
      this.showConfirmationStatus = data.showConfirmationStatus;
    }
  }

  ngOnInit() {
    if ( this.showUser ) {
      this.loadUser();
    }
  }

  timeToShow(t: string): string {
    return this.util.StrTimeToDisplayValue(t);
  }

  loadUser(): void {
    this.loadingSubject.next(true);
    this.api.GetUserPublicInfo(this.reservation.UserID).subscribe(
      (user) => {
        this.username = user.Username;
        this.loadingSubject.next(false);
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }
}
