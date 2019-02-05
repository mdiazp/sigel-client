import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { Router, Route } from '@angular/router';

import { SessionService } from '@app/services/session.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private session: SessionService,
              private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.session.session !== null) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    if (this.session.session !== null) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
