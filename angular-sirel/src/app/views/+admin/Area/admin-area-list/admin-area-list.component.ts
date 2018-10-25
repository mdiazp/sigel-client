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

import { ApiService, ErrorHandlerService } from '@app/services/core';
import { Area } from '@app/models/core';
import {
  AreaNewDialogComponent
} from '@app/views/+admin/Area/area-new-dialog/area-new-dialog.component';

@Component({
  selector: 'app-admin-area-list',
  templateUrl: './admin-area-list.component.html',
  styleUrls: ['./admin-area-list.component.css']
})
export class AdminAreaListComponent implements OnInit, AfterViewInit {
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  displayedColumns = ['id', 'name', 'operations'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private dialog: MatDialog) {

    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.loadAreas();
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

  openCreateAreaDialog() {
    const dialogRef = this.dialog.open(AreaNewDialogComponent, {
      data: {
        area: new Area(0, '', '-', '-'),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadAreas();
    });
  }

  onDeleteClick(id: number) {
    this.api.AdminDeleteArea(id)
    .subscribe(
      (data) => {
        alert('The area with id ' + id + ' was deleted.');
        this.loadAreas();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadAreas(): void {
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
