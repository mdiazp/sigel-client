import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
} from '@angular/material';

import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import {
  Util,
  Area, Local, AuxAL,
  AreaFilter, LocalFilter, UserPublicInfo,
} from '@app/models/core';

@Component({
  selector: 'app-reservations-filter',
  templateUrl: './reservations-filter.component.html',
  styleUrls: ['./reservations-filter.component.css']
})
export class ReservationsFilterComponent implements OnInit {

  @Output() FilterChanges = new EventEmitter<ReservationsFilterData>();
  util = new Util();

  Ready: Observable<boolean>;
  ReadySubject = new BehaviorSubject<boolean>(false);

  filterForm: FormGroup;
  selectLocalControl: FormControl;
  selectDate: FormControl;
  autoUsername: FormControl;

  // For fill localSelect
  areas: Area[];
  locals: Local[];
  options = new Map<string, Local[]>();
  opts: AuxAL[] = [];

  // For fill autoUsername
  filteredUsers: UserPublicInfo[];
  autoUsernameSelection = new UserPublicInfo(0, '');

  constructor(public api: ApiService,
              public errh: ErrorHandlerService,
              public session: SessionService,
              public datePipe: DatePipe) {
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
    this.autoUsername = new FormControl();
    this.autoUsername.valueChanges
    .subscribe(
      (value) => {
        if (value !== '') {
          this.loadFilterUsers(value);
        } else {
          this.filteredUsers = [];
          this.autoUsernameSelection = new UserPublicInfo(0, '');
          this.filterChanges();
        }
      }
    );

    this.filterForm = new FormGroup({
      'selectLocalControl': this.selectLocalControl,
      'selectDate': this.selectDate,
      'autoUsername': this.autoUsername,
    });
  }

  GetFilterData(): ReservationsFilterData {
    let date = this.selectDate.value;
    if ( date && date !== null && date !== '' ) {
      date = this.util.DatetoStr(date).slice(0, 10);
    } else {
      date = null;
    }
    return new ReservationsFilterData(
      this.gtv(Number(this.selectLocalControl.value)),
      date,
      this.gtv(this.autoUsernameSelection.ID),
    );
  }

  filterChanges(): void {
    this.FilterChanges.emit(this.GetFilterData());
  }

  loadData(): void {
    this.api.GetAreas(new AreaFilter(null, null), this.session.getModeValue()).subscribe(
      (areas) => {
        this.areas = areas;
        this.api.GetLocals(new LocalFilter(null, null, null, null, null), this.session.getModeValue())
        .subscribe(
          (locals) => {
            this.locals = locals;
            this.fillOptions();
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

  loadFilterUsers(prefix: string): void {
    this.api.GetUserPublicInfoList(prefix).subscribe(
      (data) => {
        this.filteredUsers = data;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  displayUsername(user?: UserPublicInfo): string | undefined {
    return user ? user.Username : undefined;
  }

  onSelectUserToFilter(ev: MatAutocompleteSelectedEvent) {
    this.autoUsernameSelection = ev.option.value;
    this.filterChanges();
  }

  public gtv(x: number): number {
    if ( x === null || x === 0 ) {
      return null;
    }
    return x;
  }
}

export class ReservationsFilterData {
  constructor(public LocalID: number,
              public Date: string,
              public UserID: number) {}
}
