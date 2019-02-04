import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, BehaviorSubject, interval  } from 'rxjs';
import { map } from 'rxjs/operators';

import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { FeedbackHandlerService } from '@app/services/core';
import { NotificationsFilter, PagAndOrderFilter, Notification } from '@app/models/core';
import { NotificationsService } from '@app/services/notifications.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  opened_admin_menu: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver,
              private api: ApiService,
              private session: SessionService,
              private ntfs: NotificationsService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private router: Router,
              private route: ActivatedRoute) {
    this.opened_admin_menu = false;
  }

  ngOnInit(): void {
  }


  admin_menu_toggle() {
    this.opened_admin_menu = !this.opened_admin_menu;
  }

  onProfile(): void {
    this.router.navigate(['/session']);
  }

  logout() {
    this.api.Logout().subscribe(
      (res) => {
        this.session.Close();
        this.feedback.ShowFeedback(['La sesión fue cerrada correctamente']);
      },
      (err) => {
        this.errh.HandleError(err);
        this.session.Close();
      }
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
