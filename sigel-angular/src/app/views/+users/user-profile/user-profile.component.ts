import { Component, OnInit, Input } from '@angular/core';

import {
  User,
} from '@app/models/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
