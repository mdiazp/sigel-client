import { Component, OnInit, Input, Inject } from '@angular/core';
import { ApiService, ErrorHandlerService, FeedbackHandlerService } from '@app/services/core';
import { Util } from '@app/models/util';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Local, ReservationToCreate, Reservation } from '@app/models/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { CustomSnackbarComponent } from '@app/shared/custom-snackbar/custom-snackbar.component';
import { HM } from '../public-reservations-of-day/public-reservations-of-day.component';

@Component({
  selector: 'app-public-reserve-dialog',
  templateUrl: './public-reserve-dialog.component.html',
  styleUrls: ['./public-reserve-dialog.component.css']
})
export class PublicReserveDialogComponent implements OnInit {
  local: Local = null;
  date: Date = null;
  reservations: Reservation[] = [];
  bt: HM;
  et: HM;

  util = new Util();

  reservationForm: FormGroup;
  activityName: FormControl;
  activityDescription: FormControl;
  bth: FormControl;
  btm: FormControl;
  eth: FormControl;
  etm: FormControl;

  error: string = null;


  constructor(private api: ApiService,
              private eh: ErrorHandlerService,
              private feedback: FeedbackHandlerService,
              public dialogRef: MatDialogRef<PublicReserveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
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
      '', [Validators.required, Validators.maxLength(100)]
    );
    this.activityDescription = new FormControl(
      '', [Validators.required, Validators.maxLength(1024)]
    );
    this.bth = new FormControl(
      this.bt.h, [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.btm = new FormControl(
      this.bt.m, [Validators.required, Validators.min(0), Validators.max(59)]
    );
    this.eth = new FormControl(
      this.et.h, [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.etm = new FormControl(
      this.et.m, [Validators.required, Validators.min(0), Validators.max(59)]
    );

    this.reservationForm = new FormGroup({
      'activityName': this.activityName,
      'activityDescription': this.activityDescription,
      'bth': this.bth,
      'btm': this.btm,
      'eth': this.eth,
      'etm': this.etm
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
        message: msg,
        icon: 'error',
        style: 'error',
      },
      duration: 10000,
    });
  }

  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.showError('Horario Incorrecto');
      return;
    }

    this.error = null;
    const rtc = this.GetReservation();

    if (!this.validateNewReservation(rtc)) {
      return;
    }

    this.api.PostReservation(rtc).subscribe(
      (r) => {
        if (!r.Confirmed) {
          this.feedback.ShowFeedback(
            [
              'Su reservacion esta pendiente de revision.',
              'La reservacion necesita de su confirmacion un dia antes.'
            ]
          );
        } else {
          this.feedback.ShowFeedback(
            ['Su reservacion esta pendiente de revision.']
          );
        }
        this.dialogRef.close(true);
      },
      (err) => {
        this.eh.HandleError(err);
        this.dialogRef.close(true);
      }
    );
  }

  GetReservation(): ReservationToCreate {
    let btime: Date; btime = new Date(this.date);
    btime.setHours(Number(this.bth.value));
    btime.setMinutes(Number(this.btm.value));

    let etime: Date; etime = new Date(this.date);
    etime.setHours(Number(this.eth.value));
    etime.setMinutes(Number(this.etm.value));

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
      this.showError('La hora del inicio no puede ser mayor que la hora del fin');
      return;
    }

    const localbh = this.local.WorkingBeginTimeHours;
    const localbm = this.local.WorkingBeginTimeMinutes;
    const localeh = this.local.WorkingEndTimeHours;
    const localem = this.local.WorkingEndTimeMinutes;

    if ( bh < localbh || (bh === localbh && bm < localbm) ) {
      this.showError('La hora del inicio no esta dentro del horario laboral');
      return;
    }

    if ( eh > localeh || (eh === localeh && em > localem) ) {
      this.showError('La hora del fin no esta dentro del horario laboral');
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
