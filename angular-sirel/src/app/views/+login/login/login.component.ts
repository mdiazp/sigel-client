import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
              private errh: ErrorHandlerService) {

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
        (res) => {
          this.session.Open(res.json());
          this.router.navigate(['home']);
        },
        (error) => this.errh.HandleError(error)
      );
    }
  }
}
