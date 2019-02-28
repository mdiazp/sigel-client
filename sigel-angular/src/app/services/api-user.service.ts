import { APIDataSource } from '@app/datasources/core';
import { ApiService } from '@app/services/api.service';
import { User, UserFilter } from '@app/models/core';
import { Observable } from 'rxjs';

export class APIUserDataSource implements APIDataSource {
    constructor(private api: ApiService) {}

    GetCollection(filter?: UserFilter): Observable<User[]> {
        return this.api.GetUsers(filter);
    }

    GetCount(filter?: UserFilter): Observable<number> {
        return this.api.GetUsersCount(filter);
    }
}
