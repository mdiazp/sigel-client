import { Component, OnInit } from '@angular/core';
import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Local } from '@app/models/core';

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

  local = new Local(0, 0, '', '', '', '', '', 0, 0, 0, 0, false);

  beforeNgOnInit = true;

  constructor(private api: ApiService,
              private session: SessionService,
              private eh: ErrorHandlerService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      (params) => {
        console.log('onParamsChange: id=', params.id, '  tab=', params.tab);

        if (params.id !== this.localID) {
          this.localID = params.id;
          if (!this.beforeNgOnInit) {
            this.prepareInitialData();
          }
        }
        this.selectedTab = this.getTab(params.tab);
      }
    );
  }

  ngOnInit() {
    this.beforeNgOnInit = false;
    this.prepareInitialData();
  }

  showAdminsTab(): Observable<boolean> {
    return this.session.isSuperadmin();
  }

  prepareInitialData(): void {
    console.log('prepareInitialData');
    this.loadingInitialDataSubject.next(true);
    this.api.GetLocal(this.localID).subscribe(
      (local) => {
        this.local = local;
        this.loadingInitialDataSubject.next(false);
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  getTabName(tab: number): string {
    console.log('tab = ', tab);
    if (tab === 1) {
      return 'settings';
    }
    if (tab === 2) {
      return 'admins';
    }
    return 'profile';
  }

  getTab(tabName: string): number {
    console.log('tabName = ', tabName);

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
}
