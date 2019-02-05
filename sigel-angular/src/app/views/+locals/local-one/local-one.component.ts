import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSlideToggle } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';

import { Local, Area } from '@app/models/core';
import { LocalProfileComponent } from '@app/views/+locals/common/local-profile/local-profile.component';
import {
  LocalInfoFormComponent,
  LocalInfo,
} from '@app/views/+locals/common/local-info-form/local-info-form.component';
import {
  LocalLaboralTimeFormComponent,
  LocalLaboralTime,
} from '@app/views/+locals/common/local-laboral-time-form/local-laboral-time-form.component';
import { ApiService, ErrorHandlerService, SessionService, FeedbackHandlerService } from '@app/services/core';

@Component({
  selector: 'app-local-one',
  templateUrl: './local-one.component.html',
  styleUrls: ['./local-one.component.css']
})
export class LocalOneComponent implements OnInit, AfterViewInit {

  localID: number;
  local: Local;
  localArea: Area;
  @ViewChild(LocalProfileComponent) localProfile: LocalProfileComponent;

  @ViewChild(MatSlideToggle) enableSlideToggle: MatSlideToggle;
  @ViewChild(LocalInfoFormComponent) localInfo: LocalInfoFormComponent;
  @ViewChild(LocalLaboralTimeFormComponent) localLaboralTime: LocalLaboralTimeFormComponent;

  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean>;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public api: ApiService,
              public errh: ErrorHandlerService,
              public feedback: FeedbackHandlerService,
              public session: SessionService) {
    this.route.params.subscribe(
      params => {
        this.localID = params.id;
      }
    );
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.LoadData();
  }

  ngAfterViewInit() {
  }

  EditarLocal(): void {
    console.log('EditarLocal');

    let li: LocalInfo; li = this.local;
    if ( this.localInfo && this.localInfo !== null ) {
      li = this.localInfo.localInfoSubmited;
    }

    let llt: LocalLaboralTime; llt = this.local;
    if ( this.localLaboralTime && this.localLaboralTime !== null ) {
      llt = this.localLaboralTime.localLaboralTimeSubmitted;
    }

    let etor: boolean; etor = this.local.EnableToReserve;
    if ( this.enableSlideToggle && this.enableSlideToggle !== null ) {
      etor = this.enableSlideToggle.checked;
    }

    const local = new Local(
      li.ID,
      li.AreaID,
      li.Name,
      li.Description,
      li.Location,
      llt.WorkingMonths,
      llt.WorkingWeekDays,
      llt.WorkingBeginTimeHours,
      llt.WorkingBeginTimeMinutes,
      llt.WorkingEndTimeHours,
      llt.WorkingEndTimeMinutes,
      etor
    );

    console.log('llt.WorkingEndTimeMinutes = ', llt.WorkingEndTimeMinutes);

    this.api.PatchLocal(local).subscribe(
      (data) => {
        this.local = data;
        this.localProfile.reset(data);
        this.feedback.ShowFeedback(['El local fue actualizado correctamente']);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  DeleteLocal(): void {
    this.api.DeleteLocal(this.local.ID).subscribe(
      (_) => {
        this.router.navigate(['locals']);
        this.feedback.ShowFeedback(['El local fue eliminado correctamente']);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  LoadData() {
    this.loadingSubject.next(true);
    this.api.GetLocal(this.localID, this.session.getModeValue()).subscribe(
      (local) => {
        this.local = local;
        this.api.GetArea(this.local.AreaID, this.session.getModeValue()).subscribe(
          (area) => {
            this.localArea = area;
            this.loadingSubject.next(false);
          },
          (err) => {
            this.errh.HandleError(err);
          }
        );
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
