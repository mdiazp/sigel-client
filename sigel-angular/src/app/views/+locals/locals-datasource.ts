import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Local, LocalFilter} from '@app/models/local';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import { ApiService, SessionService } from '@app/services/core';

export class LocalDataSource implements DataSource<Local> {

    private localsSubject = new BehaviorSubject<Local[]>([]);
    private countSubject = new BehaviorSubject<number>(0);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public count$ = this.countSubject.asObservable();

    constructor(private api: ApiService,
                private session: SessionService,
                private eh: ErrorHandlerService) {}

    load(loadCount: boolean, filter?: LocalFilter) {
      this.loadingSubject.next(true);
      if ( loadCount ) {
        this.loadCount(filter);
      } else {
        this.loadLocals(filter);
      }
    }

    private loadCount(filter?: LocalFilter) {
      this.api.GetLocalsCount(filter).subscribe(
        count => {
          this.countSubject.next(count);
          this.loadLocals(filter);
        },
        (e) => {
          this.countSubject.next(0);
          this.localsSubject.next([]);
          this.eh.HandleError(e);
        }
      );
    }

    private loadLocals(filter?: LocalFilter) {
      this.api.GetLocals(filter, this.session.getModeValue()).subscribe(
        Locals => this.localsSubject.next(Locals),
        (e) => {
          this.localsSubject.next([]);
          this.eh.HandleError(e);
        }
      );
    }

    connect(collectionViewer: CollectionViewer): Observable<Local[]> {
        return this.localsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.localsSubject.complete();
        this.loadingSubject.complete();
    }
}

