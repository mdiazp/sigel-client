import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import {
  ApiService
} from '@app/services/api.service';

import {
  ErrorHandlerService
} from '@app/services/error-handler.service';

import { Area } from '@app/models/area';

@Component({
  selector: 'app-admin-area',
  templateUrl: './admin-area.component.html',
  styleUrls: ['./admin-area.component.css']
})
export class AdminAreaComponent implements OnInit {

  area_id: string;
  area = new Area(0, '', '', '');
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  constructor(private route: ActivatedRoute,
              private api: ApiService,
              private errh: ErrorHandlerService) {
    this.route.params.subscribe(
      params => {
        this.area_id = params.id;
      }
    );

    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.loadingSubject.next(true);

    this.api.AdminGetArea(this.area_id).subscribe(
      (area) => {
        console.log(area);
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
