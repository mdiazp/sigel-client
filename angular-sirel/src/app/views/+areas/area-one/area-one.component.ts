import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { SessionService, ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { Area } from '@app/models/core';

@Component({
  selector: 'app-area-one',
  templateUrl: './area-one.component.html',
  styleUrls: ['./area-one.component.css']
})
export class AreaOneComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  areaID: number;
  area: Area;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private api: ApiService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private session: SessionService) {
    this.route.params.subscribe(
      params => {
        this.areaID = params.id;
      }
    );
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.LoadArea();
  }

  EditarArea(area: Area): void {
    this.api.PatchArea(area).subscribe(
      (data) => {
        this.area = data;
        this.feedback.ShowFeedback('El area fue actualizada correctamente');
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  DeleteArea(): void {
    this.api.DeleteArea(this.area.ID).subscribe(
      (_) => {
        this.router.navigate(['areas']);
        this.feedback.ShowFeedback('El area fue eliminada correctamente');
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  LoadArea() {
    this.loadingSubject.next(true);

    this.api.GetArea(this.areaID, this.session.getModeValue()).subscribe(
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
