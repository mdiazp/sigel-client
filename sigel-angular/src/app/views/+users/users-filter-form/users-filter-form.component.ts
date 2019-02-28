import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ApiService, ErrorHandlerService, SessionService } from '@app/services/core';
import { User } from '@app/models/core';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-users-filter-form',
  templateUrl: './users-filter-form.component.html',
  styleUrls: ['./users-filter-form.component.css']
})
export class UsersFilterFormComponent implements OnInit {

  @Input() initialState = new UsersFilterData('', '', '', '', null);
  @Output() FilterChanges = new EventEmitter<UsersFilterData>();

  filterForm: FormGroup;
  username: FormControl;
  name: FormControl;
  email: FormControl;
  rol: FormControl;
  enable: FormControl;

  constructor(private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.username = new FormControl(this.initialState.Username);
    this.username.valueChanges.subscribe((_) => this.filterChanges());
    this.name = new FormControl(this.initialState.Name);
    this.name.valueChanges.subscribe((_) => this.filterChanges());
    this.email = new FormControl(this.initialState.Email);
    this.email.valueChanges.subscribe((_) => this.filterChanges());
    this.rol = new FormControl(this.initialState.Rol);
    this.rol.valueChanges.subscribe((_) => this.filterChanges());
    this.enable = new FormControl(
      !isNullOrUndefined(this.initialState.Enable) ? this.initialState.Enable : '',
    );
    this.enable.valueChanges.subscribe((_) => this.filterChanges());

    this.filterForm = new FormGroup({
      'username' : this.username,
      'name' : this.name,
      'email' : this.email,
      'rol' : this.rol,
      'enable' : this.enable,
    });
  }

  filterChanges(): void {
    this.FilterChanges.emit(
      this.GetFilterData()
    );
  }

  GetFilterData(): UsersFilterData {
    return new UsersFilterData(
      this.username.value,
      this.name.value,
      this.email.value,
      this.rol.value,
      this.enable.value !== '' ? this.enable.value : null,
    );
  }
}

export class UsersFilterData {
  constructor(public Username: string,
              public Name: string,
              public Email: string,
              public Rol: string,
              public Enable: boolean) {}
}
