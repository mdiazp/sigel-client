import { Injectable } from '@angular/core';
import { ResponseType } from '@angular/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';

import { SessionService } from './session.service';
import { CustomSnackbarComponent } from '../shared/custom-snackbar/custom-snackbar.component';
import { isNullOrUndefined } from 'util';

@Injectable()
export class ErrorHandlerService {

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private session: SessionService) {}

  HandleError(error: Response, msg?: string) {
    if (isNullOrUndefined(msg)) {
      msg = `${error.status} Petición incorrecta`;
    }

    switch (error.status) {
      case 0:
        msg = '500 Problema de conexión';
        break;
      case 401:
        this.session.Close();
        this.router.navigate(['/login']);
        msg = '401 No autorizado';
        break;
      case 403:
        this.router.navigate(['/home']);
        msg = '403 Acceso restringido';
        break;
      case 404:
        msg = '404 No encontrado';
        break;
      case 500:
        msg = '500 Error interno del servidor';
        break;
    }

    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      panelClass: ['custom-snackbar-error'],
      data: {
        message: msg,
        icon: 'error',
        style: 'error',
      },
      duration: 10000,
    });
  }
}
