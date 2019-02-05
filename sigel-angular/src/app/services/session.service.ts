import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StorageService } from '@app/services/storage.service';
import { Session } from '@app/models/session';
import { JwtToken } from '@app/models/jwt-token';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable()
export class SessionService {

  private ssname = 'session-info';
  private smname = 'session-mode';

  public session: Session = null;
  private is_open = new BehaviorSubject(false);
  private is_admin = new BehaviorSubject(false);
  private is_superadmin = new BehaviorSubject(false);
  private is_user_sirel = new BehaviorSubject(false);
  private have_profile = new BehaviorSubject(false);
  private session_mode = new BehaviorSubject('public');

  constructor(private router: Router,
              private storage: StorageService) {
    this.storage.setItem(this.smname, 'public');

    const sess = this.storage.getItem(this.ssname);
    if (sess) {
      this.Open(sess);
    } else {
      this.Close();
    }
  }

  changeMode(): void {
    if ( this.session === null ) {
      this.session_mode.next('public');
    } else {
      this.session_mode.next(this.session_mode.value === 'public' ? 'admin' : 'public');
    }
    this.storage.setItem(this.smname, this.session_mode.value);

    if ( this.session_mode.value === 'admin' ) {
      this.router.navigate(['/reservations']);
    } else {
      this.router.navigate(['/reserve']);
    }
  }

  getMode(): Observable<string> {
    return this.session_mode.asObservable();
  }

  getModeValue(): string {
    return this.session_mode.value;
  }

  Open(session: Session) {
    if (!session) {
      this.Close();
      return;
    }
    this.session = session;
    this.storage.setItem(this.ssname, this.session);
    this.is_open.next(true);
    this.is_admin.next(this.session.rol === 'Admin' || this.session.rol === 'Superadmin');
    this.is_superadmin.next(this.session.rol === 'Superadmin');
    this.is_user_sirel.next(this.session.rol === 'SIREL');
    this.have_profile.next(this.session.username !== 'SIREL');
  }

  Close() {
    this.session = null;
    this.storage.removeItem(this.ssname);
    this.is_open.next(false);
    this.is_admin.next(false);
    this.is_superadmin.next(false);
    this.is_user_sirel.next(false);
    this.have_profile.next(false);

    this.changeMode();
  }

  isOpen(): Observable<boolean> {
    return this.is_open.asObservable();
  }

  isAdmin(): Observable<boolean> {
    return this.is_admin.asObservable();
  }

  isSuperadmin(): Observable<boolean> {
    return this.is_superadmin.asObservable();
  }

  isUserSIREL(): Observable<boolean> {
    return this.is_user_sirel.asObservable();
  }

  haveProfile(): Observable<boolean> {
    return this.have_profile.asObservable();
  }

  getUsername(): string {
    if (this.session) {
      return this.session.username;
    }
    return '';
  }

  getUserID(): number {
    if ( this.session && this.session !== null ) {
      return this.session.userID;
    }
    return 0;
  }

  getToken(): string {
    if (this.session) {
      return this.session.jwtToken;
    }
    return null;
  }

  getnoti(): void {
  }
}
