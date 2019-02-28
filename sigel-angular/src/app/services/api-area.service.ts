import { APIDataSource } from '@app/datasources/core';
import { ApiService } from '@app/services/api.service';
import { Area, AreaFilter } from '@app/models/core';
import { Observable } from 'rxjs';

export class APIAreaDataSource implements APIDataSource {
    constructor(private api: ApiService) {}

    GetCollection(filter?: AreaFilter): Observable<Area[]> {
        return this.api.GetAreas(filter);
    }

    GetCount(filter?: AreaFilter): Observable<number> {
        return this.api.GetAreasCount(filter);
    }
}
