import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {ErrorHandlerService} from '@app/services/error-handler.service';

export class CustomDataSource<T> implements DataSource<T> {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private collectionSubject = new BehaviorSubject<T[]>([]);
    private countSubject = new BehaviorSubject<number>(0);

    constructor(private api: APIDataSource,
                private eh: ErrorHandlerService) {}

    load(loadCount: boolean, filter?: any) {
      this.loadingSubject.next(true);
      if ( loadCount ) {
        this.loadCount(filter);
      } else {
        this.loadCollection(filter);
      }
    }

    private loadCount(filter?: any) {
      this.api.GetCount(filter).subscribe(
        count => {
          this.countSubject.next(count);
          this.loadCollection(filter);
        },
        (e) => this.handleError(e)
      );
    }

    private loadCollection(filter?: any) {
      this.api.GetCollection(filter).subscribe(
        (reservations) => {
          this.collectionSubject.next(reservations);
          this.loadingSubject.next(false);
        },
        (e) => this.handleError(e)
      );
    }

    private handleError(e: any): void {
      this.countSubject.next(0);
      this.collectionSubject.next([]);
      this.loadingSubject.next(false);
      this.eh.HandleError(e);
    }

    count(): Observable<number> {
      return this.countSubject.asObservable();
    }

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
      return this.collectionSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.collectionSubject.complete();
        this.countSubject.complete();
        this.loadingSubject.complete();
    }
}

export interface APIDataSource {
   GetCollection(filter?: any): Observable<any[]>;
   GetCount(filter?: any): Observable<number>;
}
