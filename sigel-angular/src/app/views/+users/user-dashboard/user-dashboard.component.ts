import { Component, OnInit } from '@angular/core';
import { ApiService, ErrorHandlerService, SessionService, FeedbackHandlerService } from '@app/services/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { User, EditUser } from '@app/models/core';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  loadingInitialDataSubject = new BehaviorSubject<boolean>(true);
  loadingInitialData$ = this.loadingInitialDataSubject.asObservable();

  selectedTab = 0;
  userID = 0;

  user: User;
  waitingUpdateResponse = false;

  constructor(private api: ApiService,
              private session: SessionService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(
      (params) => {
        if (params.id !== this.userID) {
          this.userID = params.id;
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
    this.api.GetUser(this.userID).subscribe(
      (user) => {
        this.user = user;
        this.loadingInitialDataSubject.next(false);
      },
      (e) => this.handleError(e)
    );
  }

  handleError(e: Response): void {
    if (e.status === 404) {
      this.router.navigate(['/users']);
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
    this.router.navigate(['/users']);
  }

  onUpdateUser(user: EditUser): void {
    this.waitingUpdateResponse = true;
    this.api.PatchUser(this.userID, user).subscribe(
      (_) => {
        this.prepareInitialData();
        this.fh.ShowFeedback(['El usuario fue actualizado exitosamente']);
        this.waitingUpdateResponse = false;
      },
      (e) => {
        this.eh.HandleError(e);
        this.waitingUpdateResponse = false;
      }
    );
  }
}
