import { PagAndOrderFilter } from './pag-and-order-filter';
import { URLSearchParams } from '@angular/http';

export class Notification {
    constructor(public ID: number,
        public UserID: number,
        public Message: string,
        public CreationTime: string,
        public Readed: boolean) {}
}

export class NotificationsFilter {
    constructor(public UserID: number,
                public Readed: boolean,
                public pagAndOrderFilter: PagAndOrderFilter) {}

    public GetURLSearchParams(): URLSearchParams {
        let usp: URLSearchParams;
        usp = new URLSearchParams();
        if ( this.UserID !== null && this.UserID !== 0 ) {
          usp.append('user_id', this.UserID.toString());
        }
        if ( this.Readed !== null ) {
          usp.append('readed', this.Readed.toString());
        }
        if ( this.pagAndOrderFilter !== null ) {
          usp.appendAll( this.pagAndOrderFilter.GetUrlSearchParams() );
        }
        return usp;
    }
}
