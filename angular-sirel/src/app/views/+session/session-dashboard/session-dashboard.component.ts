import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService, ApiService, ErrorHandlerService, FeedbackHandlerService, NotificationsService } from '@app/services/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { EditProfileDialogComponent } from '@app/views/+session/edit-profile-dialog/edit-profile-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import {
  UserProfile,
  Reservation, ReservationFilter,
  Notification,
  NotificationsFilter,
  LocalFilter
} from '@app/models/core';

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
  notifications: Notification[];

  localNames = new Map<number, string>();

  selectedTab = 0;

  constructor(private api: ApiService,
              private session: SessionService,
              private eh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router,
              private ntfs: NotificationsService
              ) {
    this.route.params.subscribe(
      (params) => {
        this.selectedTab = params.tab;
      }
    );
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy(): void {
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
        this.loadLocals();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  loadLocals(): void {
    this.api.GetLocals(new LocalFilter(null, null, null, null), 'public').subscribe(
      (locals) => {
        for (let i = 0; i < locals.length; i++) {
          this.localNames.set(locals[i].ID, locals[i].Name);
        }
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
        this.loadNotifications();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  loadNotifications(): void {
    this.api.GetSessionNotifications(
      new NotificationsFilter(null, null, null)
    ).subscribe(
      (notifications) => {
        this.notifications = notifications;
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

  readNotification(ntf: Notification): void {
    this.api.ReadNotification(ntf).subscribe(
      (_) => {
        this.loadNotifications();
        this.ntfs.Restart();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }

  clearNotifications(): void {
    if ( this.notifications.length === 0 ) {
      return;
    }

    this.api.SetUserNotificationAsReaded().subscribe(
      (_) => {
        this.ntfs.Restart();
        this.loadNotifications();
      },
      (e) => {
        this.eh.HandleError(e);
      }
    );
  }
}
