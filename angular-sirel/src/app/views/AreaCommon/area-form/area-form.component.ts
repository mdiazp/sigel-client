import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import {
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';

import {
  Area,
} from '@app/models/core';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.css']
})
export class AreaFormComponent implements OnInit {

  @Input() area: Area;
  @Input() edit: boolean;
  @Output() editAreaChange = new EventEmitter<Area>();

  title: string;

  areaForm: FormGroup;
  name: FormControl;
  description: FormControl;
  location: FormControl;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService) {}

  ngOnInit() {
    this.title = this.edit ? 'Editar' : 'Crear';
    this.initForm();
  }

  initForm() {
    this.initFormControls();
    this.areaForm = new FormGroup({
      name: this.name,
      description : this.description,
      location : this.location,
    });
  }

  initFormControls() {
    this.name = new FormControl(this.area.Name, this.area.NameValidators);
    this.description = new FormControl(this.area.Description,
      this.area.DescriptionValidators);
    this.location = new FormControl(this.area.Location, this.area.LocationValidators);
  }

  onSubmit() {
    const area = new Area(
      this.area.ID,
      this.name.value,
      this.description.value,
      this.location.value,
    );
    let obs: Observable<Area>;
    obs = this.edit ? this.api.AdminPatchArea(area) : this.api.AdminPostArea(area);

    obs.subscribe(
      (data) => {
        this.editAreaChange.emit(data);
      },
      (err) => this.errh.HandleError(err)
    );
  }
}
