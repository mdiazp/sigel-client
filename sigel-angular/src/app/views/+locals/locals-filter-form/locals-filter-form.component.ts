import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import { Area } from '@app/models/core';

@Component({
  selector: 'app-locals-filter-form',
  templateUrl: './locals-filter-form.component.html',
  styleUrls: ['./locals-filter-form.component.css']
})
export class LocalsFilterFormComponent implements OnInit {

  @Input() initialState = new LocalsFilterData(0, '', null);
  @Input() showEToR = true;
  @Output() FilterChanges = new EventEmitter<LocalsFilterData>();

  filterForm: FormGroup;
  selectAreaControl: FormControl;
  enableToReserve: FormControl;
  search: FormControl;
  areas: Area[];

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) { }

  ngOnInit() {
    this.LoadAreas();
    this.initForm();
  }

  initForm(): void {
    this.search = new FormControl(this.initialState.Search);
    this.search.valueChanges.subscribe((_) => this.filterChanges());
    this.selectAreaControl = new FormControl(this.initialState.AreaID);
    this.selectAreaControl.valueChanges.subscribe((_) => this.filterChanges());
    this.enableToReserve = new FormControl(
      this.getValue(this.initialState.EnabledToReserve));
    this.enableToReserve.valueChanges.subscribe((_) => this.filterChanges());

    this.filterForm = new FormGroup({
      'search': this.search,
      'selectAreaControl': this.selectAreaControl,
      'enableToReserve': this.enableToReserve,
    });
  }

  filterChanges(): void {
    this.FilterChanges.emit(
      this.GetFilterData()
    );
  }

  GetFilterData(): LocalsFilterData {
    return new LocalsFilterData(
      Number(this.selectAreaControl.value),
      this.search.value,
      this.getBoolean(this.enableToReserve.value),
    );
  }

  LoadAreas(): void {
    this.api.GetAreas(null, this.session.getModeValue()).subscribe(
      (areas) => {
        this.areas = areas;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  private getValue(t: boolean): number {
    if ( t === null ) {
      return 0;
    }
    if ( t ) {
      return 1;
    }
    return 2;
  }

  private getBoolean(v: number): boolean {
    if ( v === 0 ) {
      return null;
    }
    if ( v === 1 ) {
      return true;
    }
    return false;
  }
}

export class LocalsFilterData {
  constructor(public AreaID: number,
              public Search: string,
              public EnabledToReserve: boolean) {}
}
