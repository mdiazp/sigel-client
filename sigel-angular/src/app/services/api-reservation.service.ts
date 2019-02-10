import { APIDataSource } from '@app/datasources/core';
import { ApiService } from '@app/services/api.service';
import { ReservationFilter, ReservationWithUsername } from '@app/models/core';
import { Observable } from 'rxjs';

export class APIReservationDataSource implements APIDataSource {
    constructor(private api: ApiService) {}

    GetCollection(filter?: ReservationFilter): Observable<ReservationWithUsername[]> {
        return this.api.GetReservationsWithUsername(filter);
    }

    GetCount(filter?: any): Observable<number> {
        return this.api.GetReservationsCount(filter);
    }
}
