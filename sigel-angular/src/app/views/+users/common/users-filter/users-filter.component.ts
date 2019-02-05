import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserFilter } from '@app/models/user';

@Component({
  selector: 'app-users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.css']
})
export class UsersFilterComponent implements OnInit {

  @Output() FilterChanges = new EventEmitter<UsersFilter>();

  filterForm: FormGroup;
  username: FormControl;
  name: FormControl;
  email: FormControl;
  rol: FormControl;
  enable: FormControl;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.username = new FormControl('');
    this.username.valueChanges.subscribe((_) => this.filterChanges());
    this.name = new FormControl('');
    this.name.valueChanges.subscribe((_) => this.filterChanges());
    this.email = new FormControl('');
    this.email.valueChanges.subscribe((_) => this.filterChanges());
    this.rol = new FormControl('');
    this.rol.valueChanges.subscribe((_) => this.filterChanges());
    this.enable = new FormControl('');
    this.enable.valueChanges.subscribe((_) => this.filterChanges());

    this.filterForm = new FormGroup({
      'username' : this.username,
      'name' : this.name,
      'email' : this.email,
      'rol' : this.rol,
      'enable' : this.enable,
    });
  }

  private filterChanges(): void {
    const filter = new UsersFilter(
      this.username.value,
      this.name.value,
      this.email.value,
      this.rol.value,
      this.toBoolean(this.enable.value)
    );
    this.FilterChanges.emit(filter);
  }

  private toBoolean(v: string): boolean {
    if ( v === 'true' ) {
      return true;
    }
    if ( v === 'false' ) {
      return false;
    }
    return null;
  }
}

export class UsersFilter {
  constructor(public Username: string,
              public Name: string,
              public Email: string,
              public Rol: string,
              public Enable: boolean) {}
}
