import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService, ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '@app/models/user';
import { MatDialog } from '@angular/material';
import { EditProfileDialogComponent } from '@app/views/+session/edit-profile-dialog/edit-profile-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { Reservation, ReservationFilter } from '@app/models/core';

@Component({
  selector: 'app-session-dashboard',
  templateUrl: './session-dashboard.component.html',
  styleUrls: ['./session-dashboard.component.css']
})
export class SessionDashboardComponent implements OnInit, OnDestroy {

  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  serverTime: Date;
  userProfile: UserProfile;
  commingReservations: Reservation[];

  selectedTab = 0;

  constructor(private api: ApiService,
              private session: SessionService,
              private eh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              ) {
    this.route.params.subscribe(
      (params) => {
        this.selectedTab = params.tab;
      }
    );
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loadData();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  editProfile(): void {
    const ref = this.dialog.open(
      EditProfileDialogComponent,
      {
        data: {
          userProfile: this.userProfile,
        },
      },
    );

    ref.afterClosed().subscribe(
      (userProfile) => {
        if ( !isNullOrUndefined(userProfile) ) {
          this.userProfile = userProfile;
        }
      }
    );
  }

  loadData(): void {
    this.loadServerTime();
  }

  loadServerTime(): void {
    this.loadingSubject.next(true);
    this.api.GetServerTime().subscribe(
      (serverTime) => {
        this.serverTime = serverTime;
        this.loadProfile();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  loadProfile(): void {
    this.api.GetProfile().subscribe(
      (userProfile) => {
        this.userProfile = userProfile;
        this.loadCommingReservations();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  loadCommingReservations(): void {
    this.api.GetUserReservations(this.serverTime).subscribe(
      (creservations) => {
        this.commingReservations = creservations;
        this.loadingSubject.next(false);
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  onConfirm(reservation: Reservation): void {
    this.api.ConfirmReservation(reservation.ID).subscribe(
      (r) => {
        this.feedback.ShowFeedback(['La reservacion fue confirmada correctamente']);
        this.loadData();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }
}
