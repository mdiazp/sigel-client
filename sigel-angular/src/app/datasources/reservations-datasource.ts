import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Reservation, ReservationFilter} from '@app/models/reservation';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import { ApiService, SessionService } from '@app/services/core';

export class ReservationDataSource implements DataSource<Reservation> {

    private reservationsSubject = new BehaviorSubject<Reservation[]>([]);
    private countSubject = new BehaviorSubject<number>(0);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public count$ = this.countSubject.asObservable();

    constructor(private api: ApiService,
                private session: SessionService,
                private eh: ErrorHandlerService) {}

    load(loadCount: boolean, filter?: ReservationFilter) {
      this.loadingSubject.next(true);
      if ( loadCount ) {
        this.loadCount(filter);
      } else {
        this.loadReservations(filter);
      }
    }

    private loadCount(filter?: ReservationFilter) {
      this.api.GetReservationsCount(filter).subscribe(
        count => {
          this.countSubject.next(count);
          this.loadReservations(filter);
        },
        (e) => {
          this.countSubject.next(0);
          this.reservationsSubject.next([]);
          this.eh.HandleError(e);
        }
      );
    }

    private loadReservations(filter?: ReservationFilter) {
      this.api.GetReservations(filter, this.session.getModeValue()).subscribe(
        reservations => this.reservationsSubject.next(reservations),
        (e) => {
          this.reservationsSubject.next([]);
          this.eh.HandleError(e);
        }
      );
    }

    connect(collectionViewer: CollectionViewer): Observable<Reservation[]> {
        return this.reservationsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.reservationsSubject.complete();
        this.loadingSubject.complete();
    }
}

