import { Component, OnInit, ViewChild } from '@angular/core';

import {
  LocalsTableComponent
} from '@app/views/+locals/common/locals-table/locals-table.component';
import {
  LocalInfoFormComponent
} from '@app/views/+locals/common/local-info-form/local-info-form.component';


import { ApiService, SessionService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { Local } from '@app/models/core';

@Component({
  selector: 'app-local-all',
  templateUrl: './local-all.component.html',
  styleUrls: ['./local-all.component.css']
})
export class LocalAllComponent implements OnInit {

  @ViewChild(LocalsTableComponent) locals: LocalsTableComponent;
  @ViewChild(LocalInfoFormComponent) createForm: LocalInfoFormComponent;

  expandCreateLocal = false;

  constructor(public api: ApiService,
              public session: SessionService,
              public errh: ErrorHandlerService,
              public feedback: FeedbackHandlerService) { }

  ngOnInit() {
  }

  onOpenCreateLocal(): void {
    this.expandCreateLocal = true;
  }

  CreateLocal(local: Local) {
    local.EnableToReserve = false;
    local.WorkingMonths = '111111111111';
    local.WorkingWeekDays = '0111112';
    local.WorkingBeginTimeHours = 8;
    local.WorkingBeginTimeMinutes = 0;
    local.WorkingEndTimeHours = 17;
    local.WorkingEndTimeMinutes = 0;

    this.api.PostLocal(local).subscribe(
      (data) => {
        this.createForm.Reset();
        this.locals.LoadLocals();
        this.feedback.ShowFeedback(['El local fue creado correctamente']);
        this.expandCreateLocal = false;
      },
      (err) => {
        this.errh.HandleError(err, 'Existe otro local con el mismo nombre.');
      }
    );
  }
}
