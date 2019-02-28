import { Component, OnInit, Input, Inject } from '@angular/core';
import { ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { Util, HM } from '@app/models/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Local, ReservationToCreate, Reservation } from '@app/models/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { CustomSnackbarComponent } from '@app/shared/custom-snackbar/custom-snackbar.component';
import { InfoDialogComponent } from '@app/shared/info-dialog/info-dialog.component';

@Component({
  selector: 'app-public-reserve-dialog',
  templateUrl: './public-reserve-dialog.component.html',
  styleUrls: ['./public-reserve-dialog.component.css']
})
export class PublicReserveDialogComponent implements OnInit {
  local: Local = null;
  date: Date = null;
  reservations: Reservation[] = [];
  bt: HM = new HM(0, 0);
  et: HM = new HM(0, 0);

  util = new Util();

  reservationForm: FormGroup;
  activityName: FormControl;
  activityDescription: FormControl;
  btControl: FormControl;
  etControl: FormControl;

  error: string = null;

  // pattern = '^[\p{Latin}]';
  pattern = '';

  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              public dialogRef: MatDialogRef<PublicReserveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private snackbar: MatSnackBar) {
    this.date = data.date;
    this.local = data.local;
    this.reservations = data.reservations;
    this.bt = data.bt;
    this.et = data.et;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.activityName = new FormControl(
      '', [Validators.required, Validators.maxLength(100),
          Validators.pattern(this.pattern)]
    );
    this.activityDescription = new FormControl(
      '', [Validators.required, Validators.maxLength(500),
          Validators.pattern(this.pattern)]
    );
    this.btControl = new FormControl(
      this.bt.toString(), [Validators.required]
    );
    this.etControl = new FormControl(
      this.et.toString(), [Validators.required]
    );

    this.reservationForm = new FormGroup({
      'activityName': this.activityName,
      'activityDescription': this.activityDescription,
      'btControl': this.btControl,
      'etControl': this.etControl,
    });
  }

  private getHorarioLaboral() {
    return this.util.ItoStr(this.local.WorkingBeginTimeHours, 2) + ':' +
           this.util.ItoStr(this.local.WorkingBeginTimeMinutes, 2) + ' - ' +
           this.util.ItoStr(this.local.WorkingEndTimeHours, 2) + ':' +
           this.util.ItoStr(this.local.WorkingEndTimeMinutes, 2);
  }

  showError(msg: string): void {
    this.snackbar.openFromComponent(CustomSnackbarComponent, {
      panelClass: ['custom-snackbar-error'],
      data: {
        msgs: [msg],
        icon: 'error',
        style: 'error',
      },
      duration: 10000,
    });
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.showError('Horario incorrecto');
      return;
    }

    this.error = null;
    const rtc = this.GetReservation();

    if (!this.validateNewReservation(rtc)) {
      return;
    }

    this.api.PostReservation(rtc).subscribe(
      (r) => {

        this.feedback.ShowFeedback(
          ['La reservación está pendiente de revisión.']
        );
        this.dialogRef.close(true);

        if (!r.Confirmed) {
          this.dialog.open(InfoDialogComponent, {
            data: {
              info : 'Debe confirmar la reservación un día antes.'
            }
          });
        }
      },
      (err) => {
        this.eh.HandleError(err);
        this.dialogRef.close(true);
      }
    );
  }

  GetReservation(): ReservationToCreate {
    const btStr = this.btControl.value;
    const etStr = this.etControl.value;

    let btime: Date; btime = new Date(this.date);
    btime.setHours(Number(btStr.slice(0, 2)));
    btime.setMinutes(Number(btStr.slice(3, 5)));

    let etime: Date; etime = new Date(this.date);
    etime.setHours(Number(etStr.slice(0, 2)));
    etime.setMinutes(Number(etStr.slice(3, 5)));

    const rtc = new ReservationToCreate(
      this.local.ID, this.activityName.value,
      this.activityDescription.value,
      this.util.DatetoStr(btime),
      this.util.DatetoStr(etime),
    );

    return rtc;
  }

  validateNewReservation(rtc: ReservationToCreate): boolean {
    const bh = this.gh(rtc.BeginTime);
    const bm = this.gm(rtc.BeginTime);
    const eh = this.gh(rtc.EndTime);
    const em = this.gm(rtc.EndTime);

    if ( bh > eh ||
        (bh === eh && bm > em) ) {
      this.showError('La hora de inicio no puede ser mayor que la hora de fin');
      return;
    }

    const localbh = this.local.WorkingBeginTimeHours;
    const localbm = this.local.WorkingBeginTimeMinutes;
    const localeh = this.local.WorkingEndTimeHours;
    const localem = this.local.WorkingEndTimeMinutes;

    if ( bh < localbh || (bh === localbh && bm < localbm) ) {
      this.showError('La hora de inicio no se encuentra dentro del horario laboral');
      return;
    }

    if ( eh > localeh || (eh === localeh && em > localem) ) {
      this.showError('La hora de fin no se encuentra dentro del horario laboral');
      return;
    }

    // Validate that not exists any conflict with others reservations
    for (let i = 0; i < this.reservations.length; i++) {
      const xbh = this.gh(this.reservations[i].BeginTime);
      const xbm = this.gm(this.reservations[i].BeginTime);
      const xeh = this.gh(this.reservations[i].EndTime);
      const xem = this.gm(this.reservations[i].EndTime);

      if ( eh < xbh || (eh === xbh && em < xbm) ||
           bh > xeh || (bh === xeh && bm > xem) ) {
        continue;
      }

      this.showError('Existe conflicto en el horario con otras reservaciones');
      return false;
    }

    if ((eh * 60 + em) - (bh * 60 + bm) + 1 < 30) {
      this.showError('No puede reservar por menos de 30 minutos');
      return false;
    }

    return true;
  }

  // 01234567890123456789
  // yyyy-mm-ddThh:mm:ssZ
  private gh(s: string): number {
    return this.util.getHours(s);
    // return Number(s[11]) * 10 + Number(s[12]);
  }
  private gm(s: string): number {
    return this.util.getMinutes(s);
    // return Number(s[14]) * 10 + Number(s[15]);
  }

  public dateToShow(): string {
    return this.util.DateToDisplayValue(this.date);
  }

  genSeq(begin: number, end: number): number[] {
    const x = new Array<number>();
    for ( let i = begin; i < end; i++ ) {
      x.push(i);
    }
    return x;
  }

  twoDigs(x: number): string {
    if ( x < 10 ) {
      return '0' + x.toString();
    }
    return x.toString();
  }
}
