import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import {
  SessionService,
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';

import {
  Local,
  Area,
} from '@app/models/core';

@Component({
  selector: 'app-admin-local-one',
  templateUrl: './admin-local-one.component.html',
  styleUrls: ['./admin-local-one.component.css']
})
export class AdminLocalOneComponent implements OnInit {
  local: Local;
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
        this.loadLocal(params.id);
      }
    );
    this.loading$ = this.loadingSubject.asObservable();
    this.superadmin_session = this.session.isSuperadmin();
  }

  ngOnInit() {}

  loadLocal(local_id: number) {
    this.loadingSubject.next(true);

    this.api.AdminGetLocal(local_id.toString()).subscribe(
      (local) => {
        this.local = local;
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
      }
    );
  }

}
