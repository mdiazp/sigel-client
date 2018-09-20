import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';

import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';

import { User } from '@app/models/user';
import { catchError, finalize } from 'rxjs/operators';

export class UsersDataSource implements DataSource<User> {
    private usersSubject = new BehaviorSubject<User[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private api: ApiService,
                private errh: ErrorHandlerService) {}

    connect(collectionViewer: CollectionViewer): Observable<User[]> {
      return this.usersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
      this.usersSubject.complete();
      this.loadingSubject.complete();
    }

    loadUsers(fusername = '',
              orderBy = 'id',
              orderDirection = 'asc',
              pageNumber = 0,
              pageSize = 10
              ) {
        this.loadingSubject.next(true);

        this.api.GetUsersList(fusername,
                              pageNumber,
                              pageSize,
                              )
          .subscribe(
            (users) => {
              // console.log(users.toString());
              this.usersSubject.next(users);
              this.loadingSubject.next(false);
            },
            (err) => {
              this.errh.HandleError(err);
              this.loadingSubject.next(false);
            }
          );
    }
}
