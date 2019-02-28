import { Component, OnInit } from '@angular/core';
import { ApiService, ErrorHandlerService, SessionService, FeedbackHandlerService } from '@app/services/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Area } from '@app/models/core';

@Component({
  selector: 'app-area-dashboard',
  templateUrl: './area-dashboard.component.html',
  styleUrls: ['./area-dashboard.component.css']
})
export class AreaDashboardComponent implements OnInit {

  loadingInitialDataSubject = new BehaviorSubject<boolean>(true);
  loadingInitialData$ = this.loadingInitialDataSubject.asObservable();

  selectedTab = 0;
  areaID = 0;

  area: Area;
  waitingUpdateResponse = false;

  constructor(private api: ApiService,
              private session: SessionService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      (params) => {
        if (params.id !== this.areaID) {
          this.areaID = params.id;
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
    this.api.GetArea(this.areaID).subscribe(
      (area) => {
        this.area = area;
        this.loadingInitialDataSubject.next(false);
      },
      (e) => this.handleError(e)
    );
  }

  handleError(e: Response): void {
    if (e.status === 404) {
      this.router.navigate(['/areas']);
    }
    this.eh.HandleError(e);
  }

  getTabName(tab: number): string {
    if (tab === 1) {
      return 'settings';
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
    return 0;
  }

  onClose(): void {
    this.router.navigate(['/areas']);
  }

  onUpdateArea(area: Area): void {
    this.waitingUpdateResponse = true;
    this.api.PatchArea(area).subscribe(
      (_) => {
        this.prepareInitialData();
        this.fh.ShowFeedback(['El área fue actualizada exitosamente']);
        this.waitingUpdateResponse = false;
      },
      (e) => {
        this.eh.HandleError(e);
        this.waitingUpdateResponse = false;
      }
    );
  }
}
