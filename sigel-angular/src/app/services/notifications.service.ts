import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { PagAndOrderFilter, NotificationsFilter, Notification } from '@app/models/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  /*
  ntfsUnreadSubject$ = new BehaviorSubject<Notification[]>([]);
  notificationsUnread$ = this.ntfsUnreadSubject$.asObservable();
  */

  ntfsUnreadCountSubject$ = new BehaviorSubject<number>(0);
  notificationsUnreadCount$ = this.ntfsUnreadCountSubject$.asObservable();

  timerID: any;

  constructor(private api: ApiService,
              private session: SessionService,
              private router: Router) {
    this.session.isOpen().subscribe(
      (open) => {
        if ( open ) {
          this.start();
        } else {
          this.stop();
        }
      }
    );
  }

  Restart(): void {
    this.stop();
    this.start();
  }

  private start(): void {
    this.loadNotificationsUnreadCount();
    this.timerID = setInterval( () => {
      this.loadNotificationsUnreadCount();
    }, 10000);
  }

  private stop(): void {
    clearInterval(this.timerID);
    /*this.ntfsUnreadSubject$.next([]);*/
    this.ntfsUnreadCountSubject$.next(0);
  }

  private loadNotificationsUnreadCount(): void {
    this.api.GetSessionNotificationsCount(
      new NotificationsFilter(
        null,
        false,
        null,
      )
    ).subscribe(
      (count) => {
        this.ntfsUnreadCountSubject$.next(count);
        /*this.loadNotificationsUnread();*/
      },
      (e) => {
        if ( e.status === 401 ) {
          this.session.Close();
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
