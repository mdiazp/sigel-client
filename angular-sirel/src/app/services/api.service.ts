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

import { Credentials } from '@app/models/credentials';
import { User } from '@app/models/user';
import { Area } from '@app/models/area';
import { Local } from '@app/models/local';

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
    usp.append('id', area_id);
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

  AdminLocalsList(searchByName = '',
                  pageNumber = 0,
                  pageSize = this.oo,
                  orderDirection = 'asc',
                  orderBy = 'id',
                  areaId = ''): Observable<Area[]> {
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

}
