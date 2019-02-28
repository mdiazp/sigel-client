import { Component, OnInit, ErrorHandler, ViewChild, AfterViewInit } from '@angular/core';
import { CustomDataSource } from '@app/datasources/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, ErrorHandlerService, FeedbackHandlerService, SessionService } from '@app/services/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { APIUserDataSource } from '@app/services/api-user.service';
import { UsersFilterFormComponent } from '@app/views/+users/users-filter-form/users-filter-form.component';
import { tap } from 'rxjs/operators';
import { User, UserFilter, Paginator, OrderBy } from '@app/models/core';
import { Router } from '@angular/router';
import { CheckDeleteDialogComponent } from '@app/shared/check-delete-dialog/check-delete-dialog.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  datasource: CustomDataSource<User>;
  displayedColumns = ['user'];

  @ViewChild(UsersFilterFormComponent) filter: UsersFilterFormComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  initialPageSize = 20;
  pageSizeOptions = [20, 50, 100];
  count$: Observable<number>;

  loadingInitialDataSubject = new BehaviorSubject<boolean>(true);
  loadingInitialData$ = this.loadingInitialDataSubject.asObservable();

  constructor(private api: ApiService,
              public session: SessionService,
              private eh: ErrorHandlerService,
              private fh: FeedbackHandlerService,
              private dialog: MatDialog,
              private router: Router) {}

  ngOnInit() {
    this.datasource = new CustomDataSource<User>(
      new APIUserDataSource(this.api),
      this.eh
    );
    this.count$ = this.datasource.count();
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadingInitialDataSubject.next(true);
    this.datasource.load(
      true,
      new UserFilter(
        null, null, null, null, null,
        new Paginator(0, this.initialPageSize),
        null,
      ),
    );
    this.loadingInitialDataSubject.next(false);
  }

  ngAfterViewInit() {
    this.filter.FilterChanges.subscribe(
      (_) => {
        this.paginator.pageIndex = 0;
        this.load(true);
      }
    );

    this.paginator.page
      .pipe(
        tap(() => this.load(false)),
      )
      .subscribe();
  }

  load(loadCount: boolean): void {
    const ufd = this.filter.GetFilterData();

    this.datasource.load(
      loadCount,
      new UserFilter(
        ufd.Username,
        ufd.Name,
        ufd.Email,
        ufd.Rol,
        ufd.Enable,
        new Paginator(
          this.paginator.pageIndex * this.paginator.pageSize,
          this.paginator.pageSize
        ),
        null,
      ),
    );
  }

  onShow(u: User): void {
    this.router.navigate(['/users', u.ID.toString(), 'profile']);
  }

  onEdit(u: User): void {
    this.router.navigate(['/users', u.ID.toString(), 'settings']);
  }

  onDelete(u: User): void {
  }
}
