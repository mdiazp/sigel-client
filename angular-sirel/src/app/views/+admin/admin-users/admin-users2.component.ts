import {
  Component,
  OnInit,
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

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'username', 'rol'];
  dataSource: UsersDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService) {
  }

  ngOnInit() {
    this.dataSource = new UsersDataSource(this.api, this.errh);
    this.dataSource.loadUsers(
      '', 'id', 'asc', 0, 10
    );
  }

  ngAfterViewInit() {

    // Server-Side Search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
              this.paginator.pageIndex = 0;
              this.loadUsers();
          })
      )
      .subscribe();

    // Server-Side Sorting
    this.sort.sortChange.subscribe(
      () => {
        this.paginator.pageIndex = 0;
        this.loadUsers();
      }
    );

    // Server-Side Pagination
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadUsers())
      )
      .subscribe();
  }

  loadUsers() {
    this.dataSource.loadUsers(
      this.input.nativeElement.value,
      'id',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
}
