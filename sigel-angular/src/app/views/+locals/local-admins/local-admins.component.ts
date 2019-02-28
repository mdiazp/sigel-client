import { Component, OnInit, Input } from '@angular/core';
import {
  MatTableDataSource,
  MatAutocompleteSelectedEvent,
  MatDialog
} from '@angular/material';

import {
  FormGroup,
  FormControl
} from '@angular/forms';

import {
  ApiService,
  ErrorHandlerService,
  FeedbackHandlerService,
  SessionService,
} from '@app/services/core';

import {
  UserPublicInfo,
} from '@app/models/core';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { CheckDeleteDialogComponent } from '@app/shared/check-delete-dialog/check-delete-dialog.component';

@Component({
  selector: 'app-local-admins',
  templateUrl: './local-admins.component.html',
  styleUrls: ['./local-admins.component.css']
})
export class LocalAdminsComponent implements OnInit {

  displayedColumns = ['admin'];
  dataSource = new MatTableDataSource();

  addAdminForm: FormGroup;
  autoUsername: FormControl;
  filteredUsers: UserPublicInfo[] = [];
  autoUsernameSelection = new UserPublicInfo(0, '');

  @Input() local_id: number;

  constructor(private api: ApiService,
              public session: SessionService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              private dialog: MatDialog) { }

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
    obs = this.api.GetLocalAdmins(this.local_id);
    obs.subscribe(
      (admins) => {
        this.dataSource.data = admins;
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  onDeleteAdminClick(admin: UserPublicInfo): void {
    const dialogRef = this.dialog.open(CheckDeleteDialogComponent, {
      data: {
        msg: `¿Está seguro que desea eliminar el usuario ${admin.Username} de la lista de administradores del local?`,
        color: '#f44336',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !isNullOrUndefined(result) && result === true ) {
        this.api.DeleteLocalAdmin(this.local_id, admin.ID).subscribe(
          (_) => {
            this.feedback.ShowFeedback(['El usuario fue eliminado de la lista de administradores del local correctamente.']);
            this.loadAdmins();
          },
          (err) => {
            this.errh.HandleError(err);
          }
        );
      }
    });
  }

  loadFilterUsers(value: string): void {
    this.api.GetUserPublicInfoList(value).subscribe(
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
    return (this.autoUsernameSelection.Username !== '' &&
            this.autoUsernameSelection === this.autoUsername.value);
  }

  clickOnAddAdmin(): void {
    let obs: Observable<{}>;
    obs = this.api.PutLocalAdmin(this.local_id, this.autoUsernameSelection.ID);
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
    return user ? user.Username : undefined;
  }
}
