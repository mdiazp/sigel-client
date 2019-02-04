import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService, ApiService, ErrorHandlerService } from '@app/services/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationsFilter, Util } from '@app/models/core';

@Component({
  selector: 'app-session-notifications-menu',
  templateUrl: './session-notifications-menu.component.html',
  styleUrls: ['./session-notifications-menu.component.scss']
})
export class SessionNotificationsMenuComponent implements OnInit, OnDestroy {

  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();
  notifications: Notification[] = [];

  util = new Util();

  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private ntfs: NotificationsService,
              private router: Router) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loadingSubject.next(true);
    this.api.GetSessionNotifications(new NotificationsFilter(null, false, null))
      .subscribe(
        (notifications) => {
          this.notifications = notifications;
          this.loadingSubject.next(false);
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

  ngOnDestroy() {
  }
}
