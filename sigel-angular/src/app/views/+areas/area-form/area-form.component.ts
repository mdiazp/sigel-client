import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Area, HM, WorkingTimeUtil, WorkingWeekDay, WorkingMonth } from '@app/models/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService, ErrorHandlerService } from '@app/services/core';
import { MatSlider, MatSlideToggle } from '@angular/material';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.css']
})
export class AreaFormComponent implements OnInit, AfterViewInit {

  @Input() initialData = new Area(0, '', '', '');
  @Input() buttonText = 'Actualizar';
  @Input() showRestablecerButton = false;
  @Input() disabledButtons = false;
  @Input() showButtons = true;

  @Output() SubmitForm = new EventEmitter<Area>();

  areaForm: FormGroup;
  nameFC: FormControl;
  descriptionFC: FormControl;
  locationFC: FormControl;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit(): void {
  }

  initForm(): void {
    this.nameFC = new FormControl(
      this.initialData.Name,
      [Validators.required, Validators.maxLength(100)],
    );
    this.descriptionFC = new FormControl(
      this.initialData.Description,
      [Validators.required, Validators.maxLength(500)]
    );
    this.locationFC = new FormControl(
      this.initialData.Location,
      [Validators.required, Validators.maxLength(500)]
    );

    this.areaForm = new FormGroup(
      {
        'name': this.nameFC,
        'description': this.descriptionFC,
        'location': this.locationFC,
      }
    );
  }

  getData(): Area {
    return new Area(
      this.initialData.ID,
      this.nameFC.value,
      this.descriptionFC.value,
      this.locationFC.value,
    );
  }
}
