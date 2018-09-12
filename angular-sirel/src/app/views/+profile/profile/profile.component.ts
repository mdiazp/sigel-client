import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Profile } from '@app/models/profile';
import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loading = false;
  profile = new Profile('', '', '', false);

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private router: Router) {

  }

  ngOnInit() {
    this.loading = true;
    this.api.Profile().subscribe(
      (res) => {
        this.profile = res.json();
        this.loading = false;
      },
      (err) => {
        this.errh.HandleError(err);
        this.loading = false;
      }
    );
  }

}
