import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  startWith,
  map,
} from 'rxjs/operators';
import {
  MatAutocompleteSelectedEvent,
} from '@angular/material';

import {
  ApiService,
  ErrorHandlerService,
  SessionService,
} from '@app/services/core';

import {
  Local,
  Area,
  WorkingTimeUtil,
  WorkingWeekDay,
  WorkingMonth,
} from '@app/models/core';
import { MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-local',
  templateUrl: './admin-local.component.html',
  styleUrls: ['./admin-local.component.css']
})
export class AdminLocalComponent implements OnInit {

  area: Area;
  local_id: string;
  local = new Local(0, 0, '', '', '', '', '', 0, 0, 0, 0, false);
  working_time_util = new WorkingTimeUtil();
  working_months: WorkingMonth[];
  working_week_days: WorkingWeekDay[];

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  superadmin_session: Observable<boolean>;

  constructor(private route: ActivatedRoute,
              private api: ApiService,
              private errh: ErrorHandlerService,
              private session: SessionService) {
    this.route.params.subscribe(
      params => {
        this.local_id = params.id;
      }
    );

    this.loading$ = this.loadingSubject.asObservable();
    this.superadmin_session = this.session.isSuperadmin();
  }

  ngOnInit() {
    this.loadLocal();
  }

  loadLocal() {
    this.loadingSubject.next(true);

    this.api.AdminGetLocal(this.local_id).subscribe(
      (local) => {
        this.local = local;
        this.working_months = this.working_time_util.GetWorkingMonths( this.local.WorkingMonths );
        this.working_week_days = this.working_time_util.GetWorkingWeekDays( this.local.WorkingWeekDays );
        this.loadArea();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadArea() {
    this.api.AdminGetArea(this.local.AreaID.toString()).subscribe(
      (area) => {
        this.area = area;
        this.loadingSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
        this.loadingSubject.next(false);
      }
    );
  }
}
