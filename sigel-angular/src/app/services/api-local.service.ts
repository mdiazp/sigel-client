import { APIDataSource } from '@app/datasources/core';
import { ApiService } from '@app/services/api.service';
import { Local, LocalFilter } from '@app/models/core';
import { Observable } from 'rxjs';

export class APILocalDataSource implements APIDataSource {
    constructor(private api: ApiService) {}

    GetCollection(filter?: LocalFilter): Observable<Local[]> {
        return this.api.GetLocals(filter);
    }

    GetCount(filter?: LocalFilter): Observable<number> {
        return this.api.GetLocalsCount(filter);
    }
}
