import { Injectable } from '@angular/core';
import {
  Http,
  URLSearchParams,
  Response,
  RequestOptions,
  RequestOptionsArgs,
  Headers
} from '@angular/http';
import { BehaviorSubject, Observable, Operator } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Credentials,
  User, UserFilter, EditUser, UserPublicInfo, UserProfile, EditUserProfile,
  Area, AreaFilter,
  Local, LocalFilter,
  Reservation, ReservationFilter,
} from '@app/models/core';

import { SessionService } from '@app/services/session.service';


@Injectable()
export class ApiService {
  protected bpath = 'http://localhost:8080/api';
  protected authHName = 'authHd';

  protected oo = 1000000000;

  constructor(protected http: Http,
              protected session: SessionService ) {}

  protected commonHeaders(): Headers {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (this.session.getToken()) {
      headersConfig['authHd'] = this.session.getToken();
    }
    return new Headers(headersConfig);
  }

  Login(cred: Credentials): Observable<Response> {
    return this.http.post(`${this.bpath}/public/login`, cred, { headers: this.commonHeaders() });
  }

  GetUserPublicInfoList(username = '',
                          pageNumber = 0,
                          pageSize = 10,
                         ): Observable<UserPublicInfo[]> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    if ( username !== null && username !== '' ) {
      usp.append('username', username);
    }
    usp.append('offset', (pageNumber * pageSize).toString());
    usp.append('limit', pageSize.toString());

    return this.http.get(`${this.bpath}/public/users/publicinfo`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  PublicGetAreasList(searchByName = '',
                 pageNumber = 0,
                 pageSize = this.oo,
                 orderDirection = 'asc',
                 orderBy = 'id'): Observable<Area[]> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('search', searchByName);
    usp.append('offset', (pageNumber * pageSize).toString());
    usp.append('limit', pageSize.toString());
    usp.append('orderby', orderBy);
    usp.append('orderDirection', orderDirection);

    return this.http.get(`${this.bpath}/public/areas`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  PublicGetLocalsList(
                  searchByName = '',
                  pageNumber = 0,
                  pageSize = this.oo,
                  orderDirection = 'asc',
                  orderBy = 'id',
                  areaId = ''): Observable<Local[]> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('search', searchByName);
    usp.append('offset', (pageNumber * pageSize).toString());
    usp.append('limit', pageSize.toString());
    usp.append('orderby', orderBy);
    usp.append('orderDirection', orderDirection);
    usp.append('area_id', areaId);

    return this.http.get(`${this.bpath}/public/locals`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  Logout(): Observable<Response> {
    return this.http.delete(`${this.bpath}/private/logout`, { headers: this.commonHeaders() });
  }

  GetProfile(): Observable<UserProfile> {
    return this.http.get(
      `${this.bpath}/private/profile`,
      { headers: this.commonHeaders() }
    ).pipe(
      map(res => res.json())
    );
  }

  PatchProfile(editProfile: EditUserProfile): Observable<UserProfile> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    return this.http.patch(
      `${this.bpath}/private/profile`,
      editProfile,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    )
    .pipe(
      map(
        res => res.json()
      )
    );
  }

  GetUsers(filter: UserFilter): Observable<User[]> {
    let roa: RequestOptionsArgs;
    roa = { headers: this.commonHeaders() };
    if ( filter !== null ) {
      roa.params = filter.GetURLSearchParams();
    }

    return this.http.get(`${this.bpath}/admin/users`, roa)
    .pipe(
      map(res => res.json())
    );
  }

  GetUser(userID: number): Observable<User> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('user_id', userID.toString());
    return this.http.get(`${this.bpath}/admin/user`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  PatchUser(userID: number, editUser: EditUser): Observable<User> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('user_id', userID.toString());
    return this.http.patch(
      `${this.bpath}/admin/user`,
      editUser,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    )
    .pipe(
      map(
        res => res.json()
      )
    );
  }

  GetAreas(filter: AreaFilter, mode: string): Observable<Area[]> {
    let roa: RequestOptionsArgs;
    roa = { headers: this.commonHeaders() };
    if ( filter !== null ) {
      roa.params = filter.GetURLSearchParams();
    }

    return this.http.get(`${this.bpath}/${mode}/areas`, roa)
    .pipe(
      map(res => res.json())
    );
  }

  GetArea(areaID: number, mode: string): Observable<Area> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('area_id', areaID.toString());
    return this.http.get(`${this.bpath}/${mode}/area`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  PostArea(area: Area): Observable<Area> {
    return this.http.post(
      `${this.bpath}/admin/area`,
      area,
      { headers: this.commonHeaders() }
    )
    .pipe(
      map(
        res => res.json()
      )
    );
  }

  PatchArea(area: Area): Observable<Area> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('area_id', area.ID.toString());
    return this.http.patch(
      `${this.bpath}/admin/area`,
      area,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    )
    .pipe(
      map(
        res => res.json()
      )
    );
  }

  DeleteArea(id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('area_id', id.toString());
    return this.http.delete(
      `${this.bpath}/admin/area`,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }

  GetLocals(filter: LocalFilter, mode: string): Observable<Local[]> {
    let roa: RequestOptionsArgs;
    roa = { headers: this.commonHeaders() };
    if ( filter !== null ) {
      roa.params = filter.GetURLSearchParams();
    }

    return this.http.get(`${this.bpath}/${mode}/locals`, roa)
    .pipe(
      map(res => res.json())
    );
  }

  GetLocal(localID: number, mode: string): Observable<Local> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('local_id', localID.toString());
    return this.http.get(`${this.bpath}/${mode}/local`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  PostLocal(local: Local): Observable<Local> {
    return this.http.post(
      `${this.bpath}/admin/local`,
      local,
      { headers: this.commonHeaders() }
    )
    .pipe(
      map(
        res => res.json()
      )
    );
  }

  PatchLocal(local: Local): Observable<Local> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('local_id', local.ID.toString());

    return this.http.patch(
      `${this.bpath}/admin/local`,
      local,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    )
    .pipe(
      map(
        res => res.json()
      )
    );
  }

  DeleteLocal(id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('local_id', id.toString());
    return this.http.delete(
      `${this.bpath}/admin/local`,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }

  PutLocalAdmin(local_id: number, user_id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('local_id', local_id.toString());
    usp.append('user_id', user_id.toString());
    return this.http.put(
      `${this.bpath}/admin/local/admins`,
      '',
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }

  DeleteLocalAdmin(local_id: number, user_id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('local_id', local_id.toString());
    usp.append('user_id', user_id.toString());
    return this.http.delete(
      `${this.bpath}/admin/local/admins`,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }

  GetLocalAdmins(local_id: number): Observable<UserPublicInfo[]> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('local_id', local_id.toString());
    return this.http.get(
      `${this.bpath}/admin/local/admins`,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    )
    .pipe(
      map(res => res.json())
    );
  }

  GetReservations(filter: ReservationFilter, mode: string): Observable<Reservation[]> {
    let roa: RequestOptionsArgs;
    roa = { headers: this.commonHeaders() };
    if ( filter !== null ) {
      roa.params = filter.GetURLSearchParams();
    }
    return this.http.get(`${this.bpath}/${mode}/reservations`, roa)
    .pipe(
      map(res => res.json())
    );
  }

  GetReservation(localID: number, mode: string): Observable<Reservation> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('reservation_id', localID.toString());
    return this.http.get(`${this.bpath}/${mode}/reservation`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  AcceptReservation(id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('reservation_id', id.toString());
    return this.http.patch(
      `${this.bpath}/admin/reservation`,
      {},
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }

  RefuseReservation(id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('reservation_id', id.toString());
    return this.http.delete(
      `${this.bpath}/admin/reservation`,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }
}
