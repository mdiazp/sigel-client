import { Injectable } from '@angular/core';
import { ResponseType } from '@angular/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { SessionService } from '@app/services/session.service';

@Injectable()
export class ErrorHandlerService {

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private session: SessionService) {}

  HandleError(error: Response) {
    console.log('ErrorHandler - ErrorStatusText: ', error.statusText);
    console.log('ErrorHandler - ErrorStatus: ', error.status);
    console.log('ErrorHandler - ErrorType: ', error.type);

    const time = 4000;

    switch (error.status) {
      case 0:
        this.snackBar.open(`(500) Server Internal Error`, 'X', {duration: time});
        break;
      case 401:
        this.session.Close();
        this.router.navigate(['/login']);
        this.snackBar.open(`(401) Fail Authentication`, 'X', {duration: time});
        break;
      case 403:
        this.router.navigate(['/home']);
        this.snackBar.open(`(403) Permission Denegued`, 'X', {duration: time});
        break;
      case 404:
        this.snackBar.open(`(404) Record Not Found`, 'X', {duration: time});
        break;
      case 500:
        this.snackBar.open(`(500) Server Internal Error`, 'X', {duration: time});
        break;
    }
  }
}
