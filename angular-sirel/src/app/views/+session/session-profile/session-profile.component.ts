import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionService, ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserProfile } from '@app/models/user';
import { MatDialog } from '@angular/material';
import { EditProfileDialogComponent } from '@app/views/+session/edit-profile-dialog/edit-profile-dialog.component';

@Component({
  selector: 'app-session-profile',
  templateUrl: './session-profile.component.html',
  styleUrls: ['./session-profile.component.scss']
})
export class SessionProfileComponent implements OnInit {
  @Input() userProfile: UserProfile;
  @Output() EditUserProfile = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
