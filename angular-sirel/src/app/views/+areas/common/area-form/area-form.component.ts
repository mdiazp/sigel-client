import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ApiService, ErrorHandlerService } from '@app/services/core';
import { Area } from '@app/models/area';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.css']
})
export class AreaFormComponent implements OnInit {

  @Input() area: Area = new Area(0, '', '', '');
  @Input() title: string;
  @Output() Submit = new EventEmitter<Area>();

  areaForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService) {}

  ngOnInit() {
    this.name = new FormControl(this.area.Name,
      [ Validators.required, Validators.maxLength(100)] );
    this.description = new FormControl(this.area.Description,
      [ Validators.required, Validators.maxLength(1024) ]);
    this.location = new FormControl(this.area.Location,
      [ Validators.required, Validators.maxLength(1024) ]);
    this.areaForm = new FormGroup({
      name: this.name,
      description : this.description,
      location : this.location,
    });
  }

  private submit() {
    const area = new Area(
      this.area.ID,
      this.name.value,
      this.description.value,
      this.location.value,
    );
    this.Submit.emit(area);
  }

  reset(area?: Area): void {
    if ( !area || area === null ) {
      this.area = new Area(0, '', '', '');
    }
    this.name.setValue(this.area.Name);
    this.description.setValue(this.area.Description);
    this.location.setValue(this.area.Location);
  }
}
