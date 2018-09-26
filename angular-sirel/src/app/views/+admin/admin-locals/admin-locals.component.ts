import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';

import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog,
} from '@angular/material';

import {
  Observable,
  BehaviorSubject
} from 'rxjs';


import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';

import {
  CreateLocalDialogComponent
} from '@app/views/+admin/create-local-dialog/create-local-dialog.component';

import {
  EditLocalDialogComponent
} from '@app/views/+admin/edit-local-dialog/edit-local-dialog.component';

import { Local } from '@app/models/local';

@Component({
  selector: 'app-admin-locals',
  templateUrl: './admin-locals.component.html',
  styleUrls: ['./admin-locals.component.css']
})
export class AdminLocalsComponent implements OnInit, AfterViewInit {

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  displayedColumns = ['id', 'name', 'area_id', 'enabled', 'operations'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private dialog: MatDialog) {

    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.loadTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreateLocalDialog() {
    const dialogRef = this.dialog.open(CreateLocalDialogComponent, {
      data: {},
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.loadTable();
    });
  }

  openEditLocalDialog(local: Local) {
    const dialogRef = this.dialog.open(EditLocalDialogComponent, {
      data: local,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.loadTable();
    });
  }

  onDeleteClick(id: number) {
    this.api.AdminDeleteLocal(id)
    .subscribe(
      (data) => {
        alert('The local with id ' + id + ' was deleted.');
        this.loadTable();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadTable() {
    this.loadingSubject.next(true);
    this.api.AdminGetLocalsList().subscribe(
      data => {
        this.dataSource.data = data;
        this.loadingSubject.next(false);
      },
      err => {
        this.errh.HandleError(err);
        this.loadingSubject.next(false);
      }
    );
  }
}
