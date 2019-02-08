import {
    URLSearchParams,
} from '@angular/http';
import { isNullOrUndefined } from 'util';

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
            usp.append('desc', this.ordDesc.toString());
        }
        return usp;
    }
}

export class Paginator {
  constructor(public offset: number,
              public limit: number) {}

  GetUSP(): URLSearchParams {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    if (!isNullOrUndefined(this.limit) && this.limit !== 0 ) {
      usp.append('limit', this.limit.toString());
    }
    if (!isNullOrUndefined(this.offset) ) {
      usp.append('offset', this.offset.toString());
    }
    return usp;
  }
}

export class OrderBy {
  constructor(public by: string,
              public desc: boolean) {}

  GetUSP(): URLSearchParams {
    let usp: URLSearchParams;
    usp = new URLSearchParams();
    if ( !isNullOrUndefined(this.by) && this.by !== '' ) {
      usp.append('orderby', this.by);
    }
    if ( !isNullOrUndefined(this.desc) !== null) {
      usp.append('desc', this.desc.toString());
    }
    return usp;
  }
}

