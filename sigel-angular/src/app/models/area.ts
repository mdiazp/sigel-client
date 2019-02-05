import { URLSearchParams } from '@angular/http';
import { PagAndOrderFilter } from '@app/models/pag-and-order-filter';

export class Area {
  constructor(public ID: number,
              public Name: string,
              public Description: string,
              public Location: string) {}
}

export class AreaFilter {
  constructor(public Search: string,
              public pagAndOrdFilter: PagAndOrderFilter) {}

  public GetURLSearchParams(): URLSearchParams {
    let usp: URLSearchParams;
      usp = new URLSearchParams();
      if ( this.Search !== null && this.Search !== 'null' ) {
          usp.append('search', this.Search);
      }
      if ( this.pagAndOrdFilter !== null ) {
        usp.appendAll(usp);
      }
      return usp;
  }
}
