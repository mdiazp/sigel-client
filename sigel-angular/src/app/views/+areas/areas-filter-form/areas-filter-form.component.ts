import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import { Area } from '@app/models/core';

@Component({
  selector: 'app-areas-filter-form',
  templateUrl: './areas-filter-form.component.html',
  styleUrls: ['./areas-filter-form.component.css']
})
export class AreasFilterFormComponent implements OnInit {

  @Input() initialState = new AreasFilterData('');
  @Output() FilterChanges = new EventEmitter<AreasFilterData>();

  filterForm: FormGroup;
  search: FormControl;

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.search = new FormControl(this.initialState.Search);
    this.search.valueChanges.subscribe((_) => this.filterChanges());

    this.filterForm = new FormGroup({
      'search': this.search,
    });
  }

  filterChanges(): void {
    this.FilterChanges.emit(
      this.GetFilterData()
    );
  }

  GetFilterData(): AreasFilterData {
    return new AreasFilterData(
      this.search.value,
    );
  }
}

export class AreasFilterData {
  constructor(public Search: string) {}
}
