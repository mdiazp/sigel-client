import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import {
  ApiService,
  ErrorHandlerService,
  SessionService,
  FeedbackHandlerService,
} from '@app/services/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: true;
  loginform: FormGroup;
  username: FormControl;
  password: FormControl;
  button: FormControl;
  hide = true;

  constructor(private router: Router,
              private api: ApiService,
              private session: SessionService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService) {

  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.initFormControls();
    this.loginform = new FormGroup({
      username: this.username,
      password: this.password
    });
  }

  initFormControls(): void {
    this.username = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
  }

  onSubmit(): void {
    if (this.loginform.valid) {
      this.api.Login({
        user: this.username.value,
        pass: this.password.value
      }).subscribe(
        (user) => {
          this.session.Open(user);
          this.router.navigate(['reserve']);
          this.feedback.ShowFeedback([`Bienvenido ${user.username}`]);
        },
        (error) => this.errh.HandleError(error)
      );
    }
  }
}
