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

import {
  CreateAreaDialogComponent
} from '@app/views/+admin/create-area-dialog/create-area-dialog.component';

import {
  EditAreaDialogComponent
} from '@app/views/+admin/edit-area-dialog/edit-area-dialog.component';

import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';

import { Area } from '@app/models/area';

@Component({
  selector: 'app-admin-areas',
  templateUrl: './admin-areas.component.html',
  styleUrls: ['./admin-areas.component.css']
})
export class AdminAreasComponent implements OnInit, AfterViewInit {

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  displayedColumns = ['id', 'name', 'enabled', 'operations'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private dialog: MatDialog
              ) {
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.loadTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    this.paginator.pageIndex = 0;
    this.paginator.page.emit();
  }

  openCreateAreaDialog() {
    const dialogRef = this.dialog.open(CreateAreaDialogComponent, {
      data: {},
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.loadTable();
    });
  }

  openEditAreaDialog(area: Area) {
    const dialogRef = this.dialog.open(EditAreaDialogComponent, {
      data: area,
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.loadTable();
    });
  }

  onDeleteClick(id: number) {
    this.api.AdminDeleteArea(id)
    .subscribe(
      (data) => {
        alert('The area with id ' + id + ' was deleted.');
        this.loadTable();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadTable() {
    this.loadingSubject.next(true);

    this.api.AdminGetAreasList().subscribe(
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
