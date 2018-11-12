import {
  Component, OnInit, Output, AfterViewInit, ViewChild, EventEmitter
} from '@angular/core';
import {  FormControl } from '@angular/forms';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
} from '@angular/material';

import {
  Observable,
  BehaviorSubject
} from 'rxjs';

import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import { AreaFilter } from '@app/models/core';

@Component({
  selector: 'app-areas-table',
  templateUrl: './areas-table.component.html',
  styleUrls: ['./areas-table.component.css']
})
export class AreasTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name'];
  dataSource = new MatTableDataSource();
  search = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  loading$: Observable<boolean>;
  loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) {
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.LoadAreas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  FilterByName(value: string): void {
    this.search = value;
    this.LoadAreas();
  }

  LoadAreas(): void {
    console.log('loadAreas');
    this.loadingSubject.next(true);
    const filter = new AreaFilter(this.search, null);

    this.api.GetAreas(filter, this.session.getModeValue()).subscribe(
      data => {
        this.dataSource.data = data;
        this.loadingSubject.next(false);
      },
      err => {
        this.errh.HandleError(err);
      }
    );
  }

}
