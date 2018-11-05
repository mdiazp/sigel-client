import { Component, OnInit } from '@angular/core';
import { UsersFilter } from '@app/views/+users/common/users-filter/users-filter.component';

@Component({
  selector: 'app-user-all',
  templateUrl: './user-all.component.html',
  styleUrls: ['./user-all.component.css']
})
export class UserAllComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private filterUsers(filter: UsersFilter): void {
    console.log('filterUsername = ', filter.Username);
    console.log('filterName = ', filter.Name);
    console.log('filterEmail = ', filter.Email);
    console.log('filterRol = ', filter.Rol);
    console.log('filterEnable = ', filter.Enable);
  }
}
