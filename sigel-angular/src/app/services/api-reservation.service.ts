import { APIDataSource } from '@app/datasources/core';
import { ApiService } from '@app/services/api.service';
import { ReservationFilter, Reservation } from '@app/models/core';
import { Observable } from 'rxjs';

export class APIReservationDataSource implements APIDataSource {
    constructor(private api: ApiService) {}

    GetCollection(filter?: ReservationFilter): Observable<Reservation[]> {
        return this.api.GetReservations(filter);
    }

    GetCount(filter?: any): Observable<number> {
        return this.api.GetReservationsCount(filter);
    }
}
