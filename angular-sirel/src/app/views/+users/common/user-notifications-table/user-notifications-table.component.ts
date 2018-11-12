import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator
} from '@angular/material';

import {
  ApiService,
  SessionService,
  ErrorHandlerService,
} from '@app/services/core';
import {
  Notification,
} from '@app/models/core';

@Component({
  selector: 'app-user-notifications-table',
  templateUrl: './user-notifications-table.component.html',
  styleUrls: ['./user-notifications-table.component.css']
})
export class UserNotificationsTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['date', 'message'];
  @Input() profile: boolean;
  @Input() userID: number;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) { }

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.loadNotifications();
  }

  LoadData(): void {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    console.log('this.userID = ', this.userID.toString());
    this.api.GetNotifications(
      this.userID,
      this.profile,
    )
    .subscribe(
      (notifications) => {
        this.dataSource.data = notifications;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
