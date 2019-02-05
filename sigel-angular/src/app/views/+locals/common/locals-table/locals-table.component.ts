import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import {
  Observable, BehaviorSubject,
} from 'rxjs';
import {
  MatPaginator,
  MatSort,
} from '@angular/material';

import {
  LocalsFilter
} from '@app/views/+locals/common/locals-filter-form/locals-filter-form.component';

import { SessionService, ApiService, ErrorHandlerService } from '@app/services/core';
import { Local, LocalFilter } from '@app/models/core';

@Component({
  selector: 'app-locals-table',
  templateUrl: './locals-table.component.html',
  styleUrls: ['./locals-table.component.css']
})
export class LocalsTableComponent implements OnInit, AfterViewInit {

  filterData: LocalsFilter = new LocalsFilter(0, '', null);
  dataSource = new MatTableDataSource<Local>();
  areaNames = new Map<number, string>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  loadingAreas$: Observable<boolean>;
  loadingAreasSubject = new BehaviorSubject<boolean>(false);

  constructor(public router: Router,
              public session: SessionService,
              public errh: ErrorHandlerService,
              public api: ApiService) {
    this.loadingAreas$ = this.loadingAreasSubject.asObservable();
  }

  ngOnInit() {
    this.LoadAreas();
    this.session.getMode().subscribe(
      (mode) => {
        if (this.router.url.includes('/locals')) {
          this.LoadLocals();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  FilterLocals(filter: LocalsFilter) {
    console.log('FilterLocals');
    this.filterData = filter;
    this.LoadLocals();
  }

  LoadLocals(): void {
    // console.log('LoadLocals');

    const filter = new LocalFilter(
      this.filterData.AreaID,
      this.filterData.Search,
      this.filterData.EnabledToReserve,
      null,
    );

    this.api.GetLocals(filter, this.session.getModeValue()).subscribe(
      (locals) => {
        this.dataSource.data = locals;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  GetDisplayedColumns(): string[] {
    if ( this.session.getModeValue() === 'admin' ) {
      return ['name', 'area', 'enabled'];
    } else {
      return ['name', 'area'];
    }
  }

  LoadAreas(): void {
    this.loadingAreasSubject.next(true);
    this.api.GetAreas(null, this.session.getModeValue()).subscribe(
      (areas) => {
        this.areaNames = new Map<number, string>();
        for ( let i = 0; i < areas.length; i++ ) {
          this.areaNames.set(areas[i].ID, areas[i].Name);
        }

        this.loadingAreasSubject.next(false);
        this.LoadLocals();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
