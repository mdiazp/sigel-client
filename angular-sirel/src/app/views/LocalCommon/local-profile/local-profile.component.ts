import { Component, OnInit, Input } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import {
  SessionService,
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';
import {
  Local,
  Area,
  WorkingTimeUtil,
  WorkingMonth,
  WorkingWeekDay,
} from '@app/models/core';

@Component({
  selector: 'app-local-profile',
  templateUrl: './local-profile.component.html',
  styleUrls: ['./local-profile.component.css']
})
export class LocalProfileComponent implements OnInit {

  @Input() local: Local;
  @Input() area: Area;

  constructor() {}

  ngOnInit() {
    console.log('local = ' + this.local);
    console.log('area = ' + this.area);
    console.log('local.ID = ' + this.local.ID);
  }
}
