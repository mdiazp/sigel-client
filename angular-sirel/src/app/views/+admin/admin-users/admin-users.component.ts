import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
// import {animate, state, style, transition, trigger} from '@angular/animations';
import {
  MatPaginator,
  MatSort,
} from '@angular/material';
import {
  Observable,
  Subscription,
  BehaviorSubject,
  fromEvent,
  merge
} from 'rxjs';
import {
  tap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';

import { ApiService  } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';

import { UsersDataSource } from '@app/models/custom_cdk_collections/users_datasource';
import { User } from '@app/models/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('input') input: ElementRef;

  public users: User[];

  private nextPage: Subscription = new Subscription();

  pageSize = 10;
  pageNumber = 0;

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private api: ApiService,
              private errh: ErrorHandlerService) {
  }

  ngOnInit(): void {
    this.users = new Array<User>();
  }

  ngAfterViewInit(): void {
    // Server-Side Search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
            this.InitSearch();
          })
      )
      .subscribe();

    this.InitSearch();
  }

  InitSearch() {
    this.pageNumber = -1;
    this.NextPage();
  }

  NextPage(): void {
    this.nextPage.unsubscribe();
    this.pageNumber++;
    if (this.pageNumber === 0) {
      // this.users = [];
    }

    this.loadingSubject.next(true);

    this.nextPage = this.api.GetUsersList(
      this.input.nativeElement.value,
      this.pageNumber,
      this.pageSize
    )
    .subscribe(
      (usersPage) => {
        this.users.concat(usersPage);
        this.loadingSubject.next(false);
        console.log(this.users.length);
        console.log(this.users.toString());
      },
      (err) => {
        this.errh.HandleError(err);
        this.loadingSubject.next(false);
      }
    );
  }

  ngOnDestroy(): void {
    this.nextPage.unsubscribe();
  }
}
