import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { UsersFilter } from '@app/views/+users/common/users-filter/users-filter.component';
import { User, UserFilter } from '@app/models/core';
import { ApiService, ErrorHandlerService } from '@app/services/core';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit, AfterViewInit {

  filterData: UsersFilter = new UsersFilter('', '', '', '', null);
  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['username', 'rol', 'enable'];

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService) {
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.LoadUsers();
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  FilterUsers(filter: UsersFilter): void {
    this.filterData = filter;
    this.LoadUsers();
  }

  LoadUsers(): void {
    const filter = new UserFilter(
      this.filterData.Username,
      this.filterData.Name,
      this.filterData.Email,
      this.filterData.Rol,
      this.filterData.Enable,
      null
    );

    this.loadingSubject.next(true);
    this.api.GetUsers(filter).subscribe(
      (users) => {
        this.dataSource.data = users;
        this.loadingSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
