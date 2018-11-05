import { Component, OnInit, ViewChild } from '@angular/core';

import { AreaFormComponent } from '@app/views/+areas/common/area-form/area-form.component';
import { AreasTableComponent } from '@app/views/+areas/common/areas-table/areas-table.component';
import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import { Area } from '@app/models/core';

@Component({
  selector: 'app-area-all',
  templateUrl: './area-all.component.html',
  styleUrls: ['./area-all.component.css']
})
export class AreaAllComponent implements OnInit {

  @ViewChild(AreasTableComponent) areas: AreasTableComponent;
  @ViewChild(AreaFormComponent) createForm: AreaFormComponent;

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) { }

  ngOnInit() {
  }

  CreateArea(area: Area) {
    this.api.PostArea(area).subscribe(
      (data) => {
        this.createForm.reset();
        this.areas.LoadAreas();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
