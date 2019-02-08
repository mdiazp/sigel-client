import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-check-delete-dialog',
  templateUrl: './check-delete-dialog.component.html',
  styleUrls: ['./check-delete-dialog.component.css']
})
export class CheckDeleteDialogComponent implements OnInit {

  msg = '';
  color: string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.msg = data.msg;
    this.color = data.color;
  }

  ngOnInit() {
  }

}
