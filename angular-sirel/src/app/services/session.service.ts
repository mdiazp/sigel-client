import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StorageService } from '@app/services/storage.service';
import { Session } from '@app/models/session';
import { JwtToken } from '@app/models/jwt-token';

@Injectable()
export class SessionService {

  private ssname = 'session-info';

  public session: Session = null;
  private is_open = new BehaviorSubject(false);
  private is_admin = new BehaviorSubject(false);
  private is_superadmin = new BehaviorSubject(false);
  private have_profile = new BehaviorSubject(false);

  constructor(private storage: StorageService) {
    const sess = this.storage.getItem(this.ssname);
    if (sess) {
      this.Open(sess);
    } else {
      this.Close();
    }
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
    this.have_profile.next(this.session.rol === 'User' || this.session.rol === 'Admin');
  }

  Close() {
    this.session = null;
    this.storage.removeItem(this.ssname);
    this.is_open.next(false);
    this.is_admin.next(false);
    this.is_superadmin.next(false);
    this.have_profile.next(false);
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

  haveProfile(): Observable<boolean> {
    return this.have_profile.asObservable();
  }

  getUsername(): string {
    if (this.session) {
      return this.session.username;
    }
    return '';
  }

  getToken(): string {
    if (this.session) {
      return this.session.jwtToken;
    }
    return null;
  }
}
