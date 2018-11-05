import { Component, OnInit, Input } from '@angular/core';

import { ApiService, ErrorHandlerService } from '@app/services/core';
import { UserProfile } from '@app/models/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @Input() profile: UserProfile;

  constructor() { }

  ngOnInit() {
  }
}
