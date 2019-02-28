import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { User, EditUser } from '@app/models/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, AfterViewInit {

  @Input() initialData = new EditUser('User', true);
  @Input() buttonText = 'Actualizar';
  @Input() showRestablecerButton = false;
  @Input() disabledButtons = false;
  @Input() showButtons = true;

  @Output() SubmitForm = new EventEmitter<User>();

  userForm: FormGroup;
  enableFC: FormControl;
  rolFC: FormControl;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit(): void {
  }

  initForm(): void {
    this.enableFC = new FormControl(
      this.initialData.Enable,
      [Validators.required],
    );
    this.rolFC = new FormControl(
      this.initialData.Rol,
      [Validators.required]
    );

    this.userForm = new FormGroup(
      {
        'rolFC': this.rolFC,
        'enableFC': this.enableFC,
      }
    );
  }

  getData(): EditUser {
    return new EditUser(
      this.rolFC.value,
      this.enableFC.value,
    );
  }
}
