import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import {
  SessionService,
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';

import {
  Area,
} from '@app/models/core';

@Component({
  selector: 'app-admin-area-one',
  templateUrl: './admin-area-one.component.html',
  styleUrls: ['./admin-area-one.component.css']
})
export class AdminAreaOneComponent implements OnInit {
  area: Area;

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;
  superadmin_session: Observable<boolean>;

  constructor(private route: ActivatedRoute,
              private api: ApiService,
              private errh: ErrorHandlerService,
              private session: SessionService) {
    this.route.params.subscribe(
      params => {
        this.loadArea(params.id);
      }
    );
    this.loading$ = this.loadingSubject.asObservable();
    this.superadmin_session = this.session.isSuperadmin();
  }

  ngOnInit() {}

  loadArea(area_id: number) {
    this.loadingSubject.next(true);

    this.api.AdminGetArea(area_id.toString()).subscribe(
      (area) => {
        this.area = area;
        this.loadingSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
