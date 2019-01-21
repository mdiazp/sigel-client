import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

import { User, EditUser } from '@app/models/core';
import { ApiService,  ErrorHandlerService, SessionService, FeedbackHandlerService} from '@app/services/core';

@Component({
  selector: 'app-user-one',
  templateUrl: './user-one.component.html',
  styleUrls: ['./user-one.component.css']
})
export class UserOneComponent implements OnInit {

  loading$: Observable<boolean>;
  loadingSubject = new BehaviorSubject<boolean>(false);

  userID: number;
  user = new User(0, '', '', '', null, '', null);

  userForm: FormGroup;
  enable: FormControl;
  rol: FormControl;

  firstLoad = true;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private session: SessionService,
              private route: ActivatedRoute,
              private feedback: FeedbackHandlerService) {
    this.route.params.subscribe(
      (params) => {
        this.userID = params.id;
      }
    );
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.initForm();
    this.LoadUser();
  }

  initForm(): void {
    this.enable = new FormControl('', [Validators.required]);
    this.rol = new FormControl('', [Validators.required]);

    this.userForm = new FormGroup({
      'enable' : this.enable,
      'rol' : this.rol,
    });
  }

  EditUser(): void {
    console.log('edit user');
    const editUser = new EditUser(
      this.rol.value,
      this.enable.value,
    );
    this.api.PatchUser(this.userID, editUser).subscribe(
      (user) => {
        this.user = user;
        this.feedback.ShowFeedback('El usuario fue actualizado correctamente');
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  LoadUser(): void {
    this.loadingSubject.next(true);
    this.api.GetUser(this.userID).subscribe(
      (user) => {
        this.user = user;
        if ( this.firstLoad ) {
          this.enable.setValue(this.user.Enable);
          this.rol.setValue(this.user.Rol);
        }
        this.firstLoad = false;
        this.loadingSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }
}
