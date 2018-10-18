import { Component, OnInit, AfterViewInit, ViewChild, QueryList } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {Observable, BehaviorSubject, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';

import {
  Area,
  Local,
} from '@app/models/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, AfterViewInit {

  options = new Map<string, Local[]>();
  opts: AuxAL[] = [];

  private areas: Area[];
  private locals: Local[];

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loading: Observable<boolean>;

  filterForm: FormGroup;
  selectLocalControl: FormControl;
  selectDate: FormControl;

  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Sunday from being selected.
    return day !== 0;
  }

  constructor(private api: ApiService,
              private errh: ErrorHandlerService) {
    this.loading = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.initFilterForm();
    this.loadAreas();
  }

  ngAfterViewInit(): void {}

  loadAreas(): void {
    this.loadingSubject.next(true);
    this.api.PublicGetAreasList().subscribe(
      (areas) => {
        this.areas = areas;
        this.loadLocals();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadLocals(): void {
    this.api.PublicGetLocalsList().subscribe(
      (locals) => {
        this.locals = locals;
        this.fillOptions();
        if ( this.locals.length > 0 ) {
          this.selectLocalControl.setValue(
            this.locals[0].ID
          );
        }
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  fillOptions(): void {
    let m: Map<number, string>;
    m = new Map<number, string>();
    for ( const area of this.areas ) {
      m.set(area.ID, area.Name);
      this.options.set( area.Name, new Array<Local>() );
    }
    for ( const local of this.locals ) {
      const area = m.get(local.AreaID);
      this.options.get(area).push(local);
    }

    this.options.forEach(
      (value, key) => {
        this.opts.push(
          {
            area: key,
            locals: value
          }
        );
      }
    );

    this.loadingSubject.next(false);
    this.selectLocalControl.valueChanges.subscribe(
      (value) => this.loadReservations()
    );
    this.selectDate.valueChanges.subscribe(
      (value) => this.loadReservations()
    );
  }

  initFilterForm() {
    this.selectLocalControl = new FormControl(Validators.required);

    this.selectDate = new FormControl(
      {
        value: new Date(),
        disabled: true,
      },
      Validators.required
    );

    this.filterForm = new FormGroup({
      selectLocalControl: this.selectLocalControl,
      selectDate: this.selectDate,
    });
  }

  loadReservations(): void {
    console.log('loadReservations -- ' +
                this.selectDate.value + ' -- ' + this.selectLocalControl.value
    );
  }
}
export class AuxAL {
  constructor(public area: string,
              public locals: Local[]) {}
}
