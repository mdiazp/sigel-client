import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.css']
})
export class CustomSnackbarComponent implements OnInit {

  constructor(public ref: MatSnackBarRef<CustomSnackbarComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {
  }

  onClose() {
    this.ref.closeWithAction();
  }
}
