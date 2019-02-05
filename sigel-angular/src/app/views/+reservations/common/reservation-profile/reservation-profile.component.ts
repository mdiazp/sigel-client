import { Component, OnInit, Input } from '@angular/core';
import {
  Observable, BehaviorSubject
} from 'rxjs';

import {
  SessionService,
} from '@app/services/core';
import {
  Reservation,
  Local,
  UserPublicInfo,
} from '@app/models/core';

@Component({
  selector: 'app-reservation-profile',
  templateUrl: './reservation-profile.component.html',
  styleUrls: ['./reservation-profile.component.css']
})
export class ReservationProfileComponent implements OnInit {

  @Input() reservation: Reservation;
  @Input() local: Local;
  @Input() user: UserPublicInfo;

  constructor(public session: SessionService) {}

  ngOnInit() {
  }

}
