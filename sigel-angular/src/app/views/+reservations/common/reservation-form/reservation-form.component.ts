import {
  Component, OnInit, Input, Output,
  EventEmitter, AfterViewInit
} from '@angular/core';
import {
  FormControl, FormGroup, Validators
} from '@angular/forms';
import {
  Observable, BehaviorSubject,
} from 'rxjs';
import {
  ReservationsFilterComponent
} from '@app/views/+reservations/common/reservations-filter/reservations-filter.component';

import {
  ApiService,
  ErrorHandlerService,
  SessionService,
} from '@app/services/core';
import {
  Util,
  Local,
  Reservation, ReservationToCreate,
} from '@app/models/core';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit, AfterViewInit {

  @Input() filter: ReservationsFilterComponent;
  @Output() Submit = new EventEmitter<ReservationToCreate>();

  util = new Util();

  local: Local = null;
  reservationForm: FormGroup;
  activityName: FormControl;
  activityDescription: FormControl;
  bth: FormControl;
  btm: FormControl;
  eth: FormControl;
  etm: FormControl;

  error: string = null;

  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  constructor(private api: ApiService,
              private errh: ErrorHandlerService,
              private session: SessionService) {
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.activityName = new FormControl(
      '', [Validators.required, Validators.maxLength(100)]
    );
    this.activityDescription = new FormControl(
      '', [Validators.required, Validators.maxLength(1024)]
    );
    this.bth = new FormControl(
      0, [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.btm = new FormControl(
      0, [Validators.required, Validators.min(0), Validators.max(59)]
    );
    this.eth = new FormControl(
      0, [Validators.required, Validators.min(0), Validators.max(23)]
    );
    this.etm = new FormControl(
      0, [Validators.required, Validators.min(0), Validators.max(59)]
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

  ngAfterViewInit() {
    this.filter.Ready.subscribe(
      (ready) => {
        if (ready) {
          this.LoadData();
          this.filter.FilterChanges.subscribe(
            (_) => {
              this.LoadData();
            }
          );
        }
      }
    );
  }

  submit(): void {
    if (this.reservationForm.invalid) {
      this.error = 'Horario Incorrecto';
      return;
    }

    this.error = null;
    this.Submit.emit(this.GetReservation());
  }

  GetReservation(): ReservationToCreate {
    let btime: Date; btime = this.util.StrtoDate(this.filter.GetFilterData().Date);
    btime.setHours(Number(this.bth.value));
    btime.setMinutes(Number(this.btm.value));

    let etime: Date; etime = this.util.StrtoDate(this.filter.GetFilterData().Date);
    etime.setHours(Number(this.eth.value));
    etime.setMinutes(Number(this.etm.value));

    return new ReservationToCreate(
      this.filter.GetFilterData().LocalID, this.activityName.value,
      this.activityDescription.value,
      this.util.DatetoStr(btime),
      this.util.DatetoStr(etime),
    );
  }

  LoadData(): void {
    const filterData = this.filter.GetFilterData();

    this.loadingSubject.next(true);
    this.api.GetLocal(filterData.LocalID, this.session.getModeValue()).subscribe(
      (local) => {
        this.local = local;
        this.Reset();
        this.loadingSubject.next(false);
      },
      (err) => {
        this.errh.HandleError(err);
      }
    );
  }

  Reset(): void {
    this.bth.setValue(this.util.ItoStr(this.local.WorkingBeginTimeHours, 2));
    this.btm.setValue(this.util.ItoStr(this.local.WorkingBeginTimeMinutes, 2));

    this.eth.setValue(this.util.ItoStr(this.local.WorkingEndTimeHours, 2));
    this.etm.setValue(this.util.ItoStr(this.local.WorkingEndTimeMinutes, 2));

    this.activityName.setValue('');
    this.activityDescription.setValue('');
  }

  private getHorarioLaboral() {
    return this.util.ItoStr(this.local.WorkingBeginTimeHours, 2) + ':' +
           this.util.ItoStr(this.local.WorkingBeginTimeMinutes, 2) + ' - ' +
           this.util.ItoStr(this.local.WorkingEndTimeHours, 2) + ':' +
           this.util.ItoStr(this.local.WorkingEndTimeMinutes, 2);
  }
}
