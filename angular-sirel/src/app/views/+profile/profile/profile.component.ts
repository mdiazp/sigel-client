import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

import { UserProfile, EditUserProfile } from '@app/models/core';
import { ApiService,  ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loading$: Observable<boolean>;
  loadingSubject = new BehaviorSubject<boolean>(true);
  profile = new UserProfile(0, '', '', '', false);

  profileForm: FormGroup;
  email: FormControl;
  send: FormControl;

  firstLoad = true;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private feedback: FeedbackHandlerService) {
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.initForm();
    this.LoadProfile();
  }

  initForm(): void {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.send = new FormControl('', [Validators.required]);

    this.profileForm = new FormGroup({
      'email' : this.email,
      'send' : this.send,
    });
  }

  EditProfile(): void {
    console.log('editar profile');
    const editProfile = new EditUserProfile(
      this.email.value,
      this.send.value,
    );
    this.api.PatchProfile(editProfile).subscribe(
      (profile) => {
        this.profile = profile;
        this.feedback.ShowFeedback('Su perfil fue actualizado correctamente');
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  LoadProfile(): void {
    this.loadingSubject.next(true);
    this.api.GetProfile().subscribe(
      (profile) => {
        this.profile = profile;
        if ( this.firstLoad ) {
          this.email.setValue(this.profile.Email);
          this.send.setValue(this.profile.SendNotificationsToEmail);
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
