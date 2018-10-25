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
import { Local, Area } from '@app/models/core';
import {
  LocalNewDialogComponent
} from '@app/views/+admin/Local/local-new-dialog/local-new-dialog.component';

@Component({
  selector: 'app-admin-local-list',
  templateUrl: './admin-local-list.component.html',
  styleUrls: ['./admin-local-list.component.css']
})
export class AdminLocalListComponent implements OnInit, AfterViewInit {
  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean>;

  displayedColumns = ['id', 'name', 'area', 'enabled', 'operations'];
  dataSource = new MatTableDataSource();

  areas = new Map<number, string>();

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

  openCreateLocalDialog() {
    const dialogRef = this.dialog.open(LocalNewDialogComponent, {
      data: {
        local: new Local(0, 0, '', '-', '-', '111111111111', '1111120', 8, 0, 17, 0, false),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
    });
  }

  onDeleteClick(id: number) {
    this.api.AdminDeleteLocal(id)
    .subscribe(
      (data) => {
        alert('The local with id ' + id + ' was deleted.');
        this.loadData();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadData(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    this.loadingSubject.next(true);
    this.api.PublicGetAreasList().subscribe(
      (areas) => {
        for ( const area of areas ) {
          this.areas.set(area.ID, area.Name);
        }
        this.loadLocals();
      },
      (err) => {
        this.errh.HandleError(err);
        this.loadingSubject.next(false);
      }
    );
  }

  loadLocals(): void {
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
