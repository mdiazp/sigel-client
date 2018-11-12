import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
} from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import {
  ApiService,
  SessionService,
  ErrorHandlerService,
} from '@app/services/core';
import {
  Reservation,
  Local,
  UserPublicInfo,
} from '@app/models/core';

@Component({
  selector: 'app-reservation-one',
  templateUrl: './reservation-one.component.html',
  styleUrls: ['./reservation-one.component.css']
})
export class ReservationOneComponent implements OnInit {

  reservationID: number;
  reservation: Reservation;
  local: Local;
  user: UserPublicInfo;

  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      params => {
        this.reservationID = params.id;
      }
    );
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.LoadData();
  }

  LoadData(): void {
    this.loadingSubject.next(true);
    this.loadReservation();
  }

  private loadReservation(): void {
    this.api.GetReservation(this.reservationID, this.session.getModeValue()).subscribe(
      (r) => {
        this.reservation = r;
        this.loadLocal();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  private loadLocal(): void {
    this.api.GetLocal(this.reservation.LocalID, this.session.getModeValue()).subscribe(
      (l) => {
        this.local = l;
        this.loadUserPublicInfo();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  private loadUserPublicInfo(): void {
    this.api.GetUserPublicInfo(this.reservation.UserID).subscribe(
      (user) => {
        this.user = user;
        this.loadingSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
