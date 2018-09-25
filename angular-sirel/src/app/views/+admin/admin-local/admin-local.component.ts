import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import {
  ApiService
} from '@app/services/api.service';

import {
  ErrorHandlerService
} from '@app/services/error-handler.service';

import { Local } from '@app/models/local';

@Component({
  selector: 'app-admin-local',
  templateUrl: './admin-local.component.html',
  styleUrls: ['./admin-local.component.css']
})
export class AdminLocalComponent implements OnInit {

  local_id: string;
  local = new Local(0, 0, '', '', '', false);
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  constructor(private route: ActivatedRoute,
              private api: ApiService,
              private errh: ErrorHandlerService) {
    this.route.params.subscribe(
      params => {
        this.local_id = params.id;
      }
    );

    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.loadingSubject.next(true);

    this.api.AdminGetLocal(this.local_id).subscribe(
      (local) => {
        this.local = local;
        this.loadingSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
        this.loadingSubject.next(false);
      }
    );
  }

}
