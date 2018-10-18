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
  User,
  Area,
  Local,
  UserPublicInfo
} from '@app/models/core';

import { SessionService } from '@app/services/session.service';


@Injectable()
export class ApiService {
  bpath = 'http://localhost:8080/api';
  authHName = 'authHd';

  private oo = 1000000000;

  constructor(private http: Http,
              private session: SessionService ) {}

  private commonHeaders(): Headers {
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

  PublicGetUsernamesList(prefixFilter = '',
                          pageNumber = 0,
                          pageSize = 10,
                         ): Observable<UserPublicInfo[]> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('prefixFilter', prefixFilter);
    usp.append('offset', (pageNumber * pageSize).toString());
    usp.append('limit', pageSize.toString());

    return this.http.get(`${this.bpath}/public/users/usernames`, {
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

  Profile(): Observable<Response> {
    return this.http.get(`${this.bpath}/private/profile`, { headers: this.commonHeaders() });
  }

  GetUsersList(search = '',
               pageNumber = 0,
               pageSize = 10): Observable<User[]> {
      let usp: URLSearchParams;
      usp = new URLSearchParams();
      usp.append('search', search);
      usp.append('limit', pageSize.toString());
      usp.append('offset', (pageNumber * pageSize).toString());
      usp.append('orderby', 'id');
      usp.append('orderDirection', 'asc');

      return this.http.get(`${this.bpath}/admin/users`, {
          params: usp,
          headers: this.commonHeaders(),
      })
      .pipe(
        map(res => res.json())
      );
  }

  AdminGetAreasList(searchByName = '',
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

    return this.http.get(`${this.bpath}/admin/areas`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  AdminGetArea(area_id: string): Observable<Area> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('area_id', area_id);
    return this.http.get(`${this.bpath}/admin/area`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  AdminPostArea(area: Area): Observable<Area> {
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

  AdminPatchArea(area: Area): Observable<Area> {
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

  AdminDeleteArea(id: number) {
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

  AdminPutAreaAdmin(area_id: number, user_id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('area_id', area_id.toString());
    usp.append('user_id', user_id.toString());
    return this.http.put(
      `${this.bpath}/admin/area/admins`,
      '',
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }

  AdminDeleteAreaAdmin(area_id: number, user_id: number) {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('area_id', area_id.toString());
    usp.append('user_id', user_id.toString());
    return this.http.delete(
      `${this.bpath}/admin/area/admins`,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    );
  }

  AdminGetAreaAdmins(area_id: number): Observable<UserPublicInfo[]> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('area_id', area_id.toString());
    return this.http.get(
      `${this.bpath}/admin/area/admins`,
      {
        params: usp,
        headers: this.commonHeaders()
      }
    )
    .pipe(
      map(res => res.json())
    );
  }

  AdminGetLocalsList(searchByName = '',
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

    return this.http.get(`${this.bpath}/admin/locals`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  AdminGetLocal(local_id: string): Observable<Local> {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    usp.append('local_id', local_id);
    return this.http.get(`${this.bpath}/admin/local`, {
      params: usp,
      headers: this.commonHeaders(),
    })
    .pipe(
      map(res => res.json())
    );
  }

  AdminPostLocal(local: Local): Observable<Local> {
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

  AdminPatchLocal(local: Local): Observable<Local> {
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

  AdminDeleteLocal(id: number) {
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

  AdminPutLocalAdmin(local_id: number, user_id: number) {
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

  AdminDeleteLocalAdmin(local_id: number, user_id: number) {
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

  AdminGetLocalAdmins(local_id: number): Observable<UserPublicInfo[]> {
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
}
