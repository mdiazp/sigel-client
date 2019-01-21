import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { CustomSnackbarComponent } from '../shared/custom-snackbar/custom-snackbar.component';

@Injectable()
export class FeedbackHandlerService {

  constructor(private snackBar: MatSnackBar) {}

  ShowFeedback(msg: string) {
    /*
    const conf = new MatSnackBarConfig();
    conf.duration = 100000;
    conf.panelClass = ['snackbar-success'];
    */
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      panelClass: ['custom-snackbar-success'],
      data: {
        message: msg,
        icon: 'done',
        // icon: 'check_circle',
        style: 'success'
      },
    });
  }
}
