import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
} from '@angular/material';

import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import {
  Util,
  Area, Local, AuxAL,
  AreaFilter, LocalFilter,
} from '@app/models/core';

@Component({
  selector: 'app-public-reservation-filter',
  templateUrl: './public-reservation-filter.component.html',
  styleUrls: ['./public-reservation-filter.component.css']
})
export class PublicReservationFilterComponent implements OnInit {

  @Output() FilterChanges = new EventEmitter<PublicReservationsFilterData>();
  util = new Util();

  Ready: Observable<boolean>;
  ReadySubject = new BehaviorSubject<boolean>(false);

  filterForm: FormGroup;
  selectLocalControl: FormControl;
  selectDate: FormControl;

  // For fill localSelect
  areas: Area[];
  locals: Local[];
  options = new Map<string, Local[]>();
  opts: AuxAL[] = [];

  // ServerTime
  servertime: Date;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private session: SessionService) {
    this.Ready = this.ReadySubject.asObservable();
  }

  ngOnInit() {
    this.initFilterForm();
    this.loadData();
  }

  initFilterForm(): void {
    this.selectLocalControl = new FormControl();
    this.selectLocalControl.valueChanges.subscribe((_) => this.filterChanges());
    this.selectDate = new FormControl(
      {
        value: '',
        disabled: this.session.getModeValue() === 'public',
      }
    );
    this.selectDate.valueChanges.subscribe((_) => this.filterChanges());

    this.filterForm = new FormGroup({
      'selectLocalControl': this.selectLocalControl,
      'selectDate': this.selectDate,
    });
  }

  GetFilterData(): PublicReservationsFilterData {
    let date = this.selectDate.value;
    if ( date && date !== null && date !== '' ) {
      date = this.util.DatetoStr(date).slice(0, 10);
    } else {
      date = null;
    }
    return new PublicReservationsFilterData(
      this.gtv(Number(this.selectLocalControl.value)),
      date,
    );
  }

  filterChanges(): void {
    this.FilterChanges.emit(this.GetFilterData());
  }

  loadData(): void {
    this.api.GetServerTime().subscribe(
      (servertime) => {
        // console.log('ST = ' + servertime.toString());
        if (this.session.getModeValue() === 'public') {
          this.selectDate.setValue(servertime);
          this.servertime = servertime;
        }
        this.api.GetAreas(new AreaFilter(null, null), this.session.getModeValue()).subscribe(
          (areas) => {
            this.areas = areas;
            this.api.GetLocals(new LocalFilter(null, null, null, null), this.session.getModeValue())
            .subscribe(
              (locals) => {
                this.locals = locals;
                this.fillOptions();
                if (this.session.getModeValue() === 'public' && locals.length > 0) {
                  this.selectLocalControl.setValue( locals[0].ID );
                }
                this.ReadySubject.next(true);
              },
              (err) => {
                this.errh.HandleError(err);
              }
            );
          },
          (err) => {
            this.errh.HandleError(err);
          }
        );
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

    this.opts = [];
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
  }

  private gtv(x: number): number {
    if ( x === null || x === 0 ) {
      return null;
    }
    return x;
  }
}

export class PublicReservationsFilterData {
  constructor(public LocalID: number,
              public Date: string) {}
}
