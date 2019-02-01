import { Component, OnInit, Inject } from '@angular/core';
import { ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PublicReserveDialogComponent } from '@app/views/+public-reservations/public-reserve-dialog/public-reserve-dialog.component';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UserProfile, EditUserProfile } from '@app/models/user';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css']
})
export class EditProfileDialogComponent implements OnInit {

  editProfileForm: FormGroup;
  email: FormControl;
  send: FormControl;

  userProfile: UserProfile;

  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              public dialogRef: MatDialogRef<PublicReserveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userProfile = data.userProfile;
  }

  ngOnInit() {
    this.email = new FormControl(this.userProfile.Email, Validators.email);
    this.send = new FormControl(
      this.userProfile.SendNotificationsToEmail, Validators.required);

    this.editProfileForm = new FormGroup({
      'email' : this.email,
      'send' : this.send,
    });
  }

  EditProfile(): void {
    const editProfile = new EditUserProfile(
      this.email.value,
      this.send.value,
    );
    this.api.PatchProfile(editProfile).subscribe(
      (profile) => {
        this.userProfile = profile;
        this.feedback.ShowFeedback(['Su perfil fue actualizado correctamente']);
        this.dialogRef.close(this.userProfile);
      },
      (err) => {
        this.eh.HandleError(err);
      }
    );
  }
}
