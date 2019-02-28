import { Component, OnInit } from '@angular/core';
import { ApiService, ErrorHandlerService, SessionService, FeedbackHandlerService } from '@app/services/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Local, Area } from '@app/models/core';

@Component({
  selector: 'app-local-dashboard',
  templateUrl: './local-dashboard.component.html',
  styleUrls: ['./local-dashboard.component.css']
})
export class LocalDashboardComponent implements OnInit {

  loadingInitialDataSubject = new BehaviorSubject<boolean>(true);
  loadingInitialData$ = this.loadingInitialDataSubject.asObservable();

  selectedTab = 0;
  localID = 0;

  local: Local;
  localArea: Area;
  areas: Area[] = [];
  waitingUpdateResponse = false;

  constructor(private api: ApiService,
              private session: SessionService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      (params) => {
        if (params.id !== this.localID) {
          this.localID = params.id;
          this.prepareInitialData();
        }
        this.selectedTab = this.getTab(params.tab);
      }
    );
  }

  ngOnInit() {}

  showAdminsTab(): Observable<boolean> {
    return this.session.isSuperadmin();
  }

  prepareInitialData(): void {
    this.loadingInitialDataSubject.next(true);
    this.api.GetLocal(this.localID).subscribe(
      (local) => {
        this.local = local;

        this.api.GetAreas().subscribe(
          (areas) => {
            this.areas = areas;
            for (const a of areas) {
              if (a.ID === this.local.AreaID) {
                this.localArea = a;
              }
            }
            this.loadingInitialDataSubject.next(false);
          },
          (e) => this.handleError(e)
        );
      },
      (e) => this.handleError(e)
    );
  }

  handleError(e: Response): void {
    if (e.status === 404) {
      this.router.navigate(['/locals']);
    }
    this.eh.HandleError(e);
  }

  getTabName(tab: number): string {
    if (tab === 1) {
      return 'settings';
    }
    if (tab === 2) {
      return 'admins';
    }
    return 'profile';
  }

  getTab(tabName: string): number {
    if (tabName === 'profile') {
      return 0;
    }
    if (tabName === 'settings') {
      return 1;
    }
    if (tabName === 'admins') {
      return 2;
    }
    return 0;
  }

  onClose(): void {
    this.router.navigate(['/locals']);
  }

  onUpdateLocal(local: Local): void {
    this.waitingUpdateResponse = true;
    this.api.PatchLocal(local).subscribe(
      (_) => {
        this.prepareInitialData();
        this.fh.ShowFeedback(['El local fue actualizado exitosamente']);
        this.waitingUpdateResponse = false;
      },
      (e) => {
        this.eh.HandleError(e);
        this.waitingUpdateResponse = false;
      }
    );
  }
}
