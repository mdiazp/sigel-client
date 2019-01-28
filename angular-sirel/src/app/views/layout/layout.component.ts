import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable,  } from 'rxjs';
import { map } from 'rxjs/operators';

import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { FeedbackHandlerService } from '@app/services/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  opened_admin_menu: boolean;
  /*
  opened_session: Observable<boolean>;
  admin_session: Observable<boolean>;
  superadmin_session: Observable<boolean>;
  show_profile: Observable<boolean>;
  session_mode: Observable<string>;
  */

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver,
              private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private router: Router) {
    this.opened_admin_menu = false;
    /*
    this.opened_session = session.isOpen();
    this.admin_session = session.isAdmin();
    this.superadmin_session = session.isSuperadmin();
    this.show_profile = session.haveProfile();
    this.session_mode = session.getMode();
    */
  }

  admin_menu_toggle() {
    this.opened_admin_menu = !this.opened_admin_menu;
  }

  onProfile(): void {
    this.router.navigate(['profile']);
  }

  logout() {
    this.api.Logout().subscribe(
      (res) => {
        this.session.Close();
        this.router.navigate(['home']);
        this.feedback.ShowFeedback(['Su session ha sido cerrada correctamente']);
      },
      (err) => {
        this.errh.HandleError(err);
        this.session.Close();
        this.router.navigate(['home']);
      }
    );
  }
}
