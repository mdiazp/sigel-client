import {
    URLSearchParams
} from '@angular/http';
import {
    Validators,
    ValidatorFn,
} from '@angular/forms';
import { PagAndOrderFilter } from './pag-and-order-filter';
import { Paginator, OrderBy } from './pag-and-order-filter';
import { isNullOrUndefined } from 'util';

export class Reservation {
    constructor(public ID: number,
                public UserID: number,
                public LocalID: number,
                public ActivityName: string,
                public ActivityDescription: string,
                public BeginTime: string,
                public EndTime: string,
                public Confirmed: boolean,
                public Pending: boolean) {}
}

export class ReservationToCreate {
    constructor(public LocalID: number,
                public ActivityName: string,
                public ActivityDescription: string,
                public BeginTime: string,
                public EndTime: string) {}
}

export class ReservationFilter {
    constructor(public UserID: number,
                public LocalID: number,
                public Date: string,
                public Search: string,
                public Pending: boolean,
                public Confirmed: boolean,
                public paginator: Paginator,
                public orderby: OrderBy) {}

    public GetURLSearchParams(): URLSearchParams {
        let usp: URLSearchParams;
        usp = new URLSearchParams();
        if ( this.UserID != null ) {
            usp.append('user_id', this.UserID.toString());
        }
        if ( this.LocalID != null ) {
            usp.append('local_id', this.LocalID.toString());
        }
        if ( this.Date != null && this.Date !== 'null' ) {
            usp.append('date', this.Date);
        }
        if ( this.Search != null && this.Search !== 'null' ) {
            usp.append('search', this.Search);
        }
        if ( this.Pending != null ) {
            usp.append('pending', this.Pending.toString());
        }
        if ( !isNullOrUndefined(this.paginator) ) {
            usp.appendAll(this.paginator.GetUSP());
        }
        if ( !isNullOrUndefined(this.orderby) ) {
            usp.appendAll(this.orderby.GetUSP());
        }
        return usp;
    }

    public GetDateTransformation(): string {
        return 'yyyy-MM-dd';
    }
}
