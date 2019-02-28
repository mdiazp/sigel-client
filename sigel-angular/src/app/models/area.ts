import { URLSearchParams } from '@angular/http';
import { PagAndOrderFilter, Paginator, OrderBy } from '@app/models/pag-and-order-filter';
import { isNullOrUndefined } from 'util';

export class Area {
  constructor(public ID: number,
              public Name: string,
              public Description: string,
              public Location: string) {}
}

export class AreaFilter {
  constructor(public Search: string,
              public paginator: Paginator,
              public orderby: OrderBy) {}

  public GetURLSearchParams(): URLSearchParams {
    let usp: URLSearchParams;
      usp = new URLSearchParams();
      if ( !isNullOrUndefined(this.Search) && this.Search !== 'null' && this.Search !== '' ) {
          usp.append('search', this.Search);
      }
      if ( !isNullOrUndefined(this.paginator) ) {
        usp.appendAll(this.paginator.GetUSP());
      }
      if ( !isNullOrUndefined(this.orderby) ) {
          usp.appendAll(this.orderby.GetUSP());
      }
      return usp;
  }
}
