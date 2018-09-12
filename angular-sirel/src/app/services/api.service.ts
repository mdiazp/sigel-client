import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { BehaviorSubject, Observable, Operator } from 'rxjs';
import { map } from 'rxjs/operators';

import { Credentials } from '@app/models/credentials';
import { SessionService } from '@app/services/session.service';

@Injectable()
export class ApiService {
  bpath = 'http://localhost:8080/api';
  authHName = 'authHd';

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

  private setCommonHeaders(opt: RequestOptionsArgs) {
    if (!opt.headers) {
      opt.headers = new Headers();
    }
    if (this.session.isOpen()) {
      opt.headers.append(this.authHName, this.session.getToken());
    }
  }

  private get(url: string, opt?: RequestOptionsArgs): Observable<Response> {
    if (!opt) {
      opt = new RequestOptions();
    }
    this.setCommonHeaders(opt);
    return this.http.get(`${this.bpath}${url}`, opt);
  }

  private head(url: string, opt?: RequestOptionsArgs): Observable<Response> {
    if (!opt) {
      opt = new RequestOptions();
    }
    this.setCommonHeaders(opt);
    return this.http.head(`${this.bpath}${url}`, opt);
  }

  private post(url: string, body: any, opt?: RequestOptionsArgs): Observable<Response> {
    if (!opt) {
      opt = new RequestOptions();
    }
    this.setCommonHeaders(opt);
    return this.http.post(`${this.bpath}${url}`, body, opt);
  }

  private put(url: string, body: any, opt?: RequestOptionsArgs): Observable<Response> {
    if (!opt) {
      opt = new RequestOptions();
    }
    this.setCommonHeaders(opt);
    return this.http.put(`${this.bpath}${url}`, body, opt);
  }

  private delete(url: string, opt?: RequestOptionsArgs): Observable<Response> {
    if (!opt) {
      opt = new RequestOptions();
    }
    this.setCommonHeaders(opt);
    return this.http.delete(`${this.bpath}${url}`, opt);
  }
}
