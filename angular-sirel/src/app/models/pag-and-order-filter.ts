import {
    URLSearchParams,
} from '@angular/http';

export class PagAndOrderFilter {
    constructor(public limit: number,
                public offset: number,
                public orderby: string,
                public ordDesc: boolean) {}

    public GetUrlSearchParams(): URLSearchParams {
        let usp: URLSearchParams;
        usp = new URLSearchParams();
        if ( this.limit != null ) {
            usp.append('limit', this.limit.toString());
        }
        if ( this.offset != null ) {
            usp.append('offset', this.offset.toString());
        }
        if ( this.orderby != null && this.orderby !== 'null' ) {
            usp.append('orderby', this.orderby);
        }
        if ( this.ordDesc != null ) {
            usp.append('ordDesc', this.ordDesc.toString());
        }
        return usp;
    }
}
