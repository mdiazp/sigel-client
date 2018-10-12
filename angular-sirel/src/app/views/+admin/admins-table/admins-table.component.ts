import { Component, OnInit, Input } from '@angular/core';
import {
  MatTableDataSource,
  MatAutocompleteSelectedEvent
} from '@angular/material';

import {
  FormGroup,
  FormControl
} from '@angular/forms';

import {
  ApiService,
  ErrorHandlerService,
} from '@app/services/core';

import {
  Local,
  Area,
  User,
  UserPublicInfo,
} from '@app/models/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admins-table',
  templateUrl: './admins-table.component.html',
  styleUrls: ['./admins-table.component.css']
})
export class AdminsTableComponent implements OnInit {

  displayedColumns = ['username', 'name', 'operations'];
  dataSource = new MatTableDataSource();

  addAdminForm: FormGroup;
  autoUsername: FormControl;
  filteredUsers: UserPublicInfo[] = [];
  autoUsernameSelection = new UserPublicInfo(0, '');

  @Input() data_id: number;
  @Input() forArea: boolean;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService) { }

  ngOnInit() {
    this.loadAdmins();

    // Init addAdminForm
    this.autoUsername = new FormControl();
    this.addAdminForm = new FormGroup({
      autoUsername: this.autoUsername,
    });
    this.autoUsername.valueChanges
    .subscribe(
      (value) => {
        if (value !== '') {
          this.loadFilterUsers(value);
        } else {
          this.filteredUsers = [];
        }
      }
    );
  }

  loadAdmins() {
    let obs: Observable<UserPublicInfo[]>;
    obs = this.forArea ? this.api.AdminGetAreaAdmins(this.data_id) :
                           this.api.AdminGetLocalAdmins(this.data_id);

    obs.subscribe(
      (admins) => {
        this.dataSource.data = admins;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  onDeleteAdminClick(user_id: number): void {
    let obs: Observable<{}>;
    obs = this.forArea ? this.api.AdminDeleteAreaAdmin(this.data_id, user_id) :
                           this.api.AdminDeleteLocalAdmin(this.data_id, user_id);

    obs.subscribe(
      (_) => {
        alert(`El usuario con id(${user_id}) fue eliminado de la lista de administradores del local.`);
        this.loadAdmins();
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  loadFilterUsers(value: string): void {
    this.api.PublicGetUsernamesList(value).subscribe(
      (data) => {
        this.filteredUsers = data;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  onSelectAdminToAdd(ev: MatAutocompleteSelectedEvent) {
    this.autoUsernameSelection = ev.option.value;
  }

  validAdminSelection(): boolean {
    return (this.autoUsernameSelection.username !== '' &&
            this.autoUsernameSelection === this.autoUsername.value);
  }

  clickOnAddAdmin(): void {
    let obs: Observable<{}>;
    obs = this.forArea ? this.api.AdminPutAreaAdmin(this.data_id, this.autoUsernameSelection.id) :
                           this.api.AdminPutLocalAdmin(this.data_id, this.autoUsernameSelection.id);
    obs.subscribe(
      (_) => {
        this.loadAdmins();
        this.autoUsername.reset('');
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  displayAdminUsername(user?: UserPublicInfo): string | undefined {
    return user ? user.username : undefined;
  }
}