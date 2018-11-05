import { Component, OnInit, ViewChild } from '@angular/core';

import {
  LocalsTableComponent
} from '@app/views/+locals/common/locals-table/locals-table.component';
import {
  LocalInfoFormComponent
} from '@app/views/+locals/common/local-info-form/local-info-form.component';


import { ApiService, SessionService, ErrorHandlerService } from '@app/services/core';
import { Local } from '@app/models/core';

@Component({
  selector: 'app-local-all',
  templateUrl: './local-all.component.html',
  styleUrls: ['./local-all.component.css']
})
export class LocalAllComponent implements OnInit {

  @ViewChild(LocalsTableComponent) locals: LocalsTableComponent;
  @ViewChild(LocalInfoFormComponent) createForm: LocalInfoFormComponent;

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) { }

  ngOnInit() {
  }

  CreateLocal(local: Local) {
    local.EnableToReserve = false;
    local.WorkingMonths = '111111111111';
    local.WorkingWeekDays = '1111120';
    local.WorkingBeginTimeHours = 8;
    local.WorkingBeginTimeMinutes = 0;
    local.WorkingEndTimeHours = 5;
    local.WorkingEndTimeMinutes = 0;

    this.api.PostLocal(local).subscribe(
      (data) => {
        this.createForm.Reset();
        this.locals.LoadLocals();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
