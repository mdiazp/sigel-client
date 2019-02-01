import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { Router, Route } from '@angular/router';

import { SessionService } from '@app/services/session.service';

@Injectable()
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private session: SessionService,
              private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const s = this.session.session;
    if (s !== null && (s.rol === 'Admin' || s.rol === 'Superadmin')) {
      return true;
    }
    this.router.navigate(['/reserve']);
    return false;
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    const s = this.session.session;
    if (s !== null && (s.rol === 'Admin' || s.rol === 'Superadmin')) {
      return true;
    }
    this.router.navigate(['/reserve']);
    return false;
  }
}
