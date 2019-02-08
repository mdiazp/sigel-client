import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Area, AreaFilter} from '@app/models/area';
import {ErrorHandlerService} from '@app/services/error-handler.service';
import { ApiService, SessionService } from '@app/services/core';

export class AreaDataSource implements DataSource<Area> {

    private areasSubject = new BehaviorSubject<Area[]>([]);
    private countSubject = new BehaviorSubject<number>(0);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public count$ = this.countSubject.asObservable();

    constructor(private api: ApiService,
                private session: SessionService,
                private eh: ErrorHandlerService) {}

    load(loadCount: boolean, filter?: AreaFilter) {
      this.loadingSubject.next(true);
      if ( loadCount ) {
        this.loadCount(filter);
      } else {
        this.loadAreas(filter);
      }
    }

    private loadCount(filter?: AreaFilter) {
      this.api.GetAreasCount(filter).subscribe(
        count => {
          this.countSubject.next(count);
          this.loadAreas(filter);
        },
        (e) => {
          this.countSubject.next(0);
          this.areasSubject.next([]);
          this.eh.HandleError(e);
        }
      );
    }

    private loadAreas(filter?: AreaFilter) {
      this.api.GetAreas(filter, this.session.getModeValue()).subscribe(
        Areas => this.areasSubject.next(Areas),
        (e) => {
          this.areasSubject.next([]);
          this.eh.HandleError(e);
        }
      );
    }

    connect(collectionViewer: CollectionViewer): Observable<Area[]> {
        return this.areasSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.areasSubject.complete();
        this.loadingSubject.complete();
    }
}

