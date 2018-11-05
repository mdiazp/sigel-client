import { URLSearchParams } from '@angular/http';
import { PagAndOrderFilter } from '@app/models/core';

export class Local {
  constructor(public ID: number,
              public AreaID: number,
              public Name: string,
              public Description: string,
              public Location: string,
              public WorkingMonths: string,
              public WorkingWeekDays: string,
              public WorkingBeginTimeHours: number,
              public WorkingBeginTimeMinutes: number,
              public WorkingEndTimeHours: number,
              public WorkingEndTimeMinutes: number,
              public EnableToReserve: boolean) {}
}

export class LocalFilter {
    constructor(public AreaID: number,
                public Search: string,
                public EnableToReserve: boolean,
                public pagAndOrderFilter: PagAndOrderFilter) {}

    public GetURLSearchParams(): URLSearchParams {
        let usp: URLSearchParams;
        usp = new URLSearchParams();
        if ( this.AreaID !== null && this.AreaID !== 0 ) {
          usp.append('area_id', this.AreaID.toString());
        }
        if ( this.Search !== null && this.Search !== 'null' && this.Search !== '' ) {
          usp.append('search', this.Search);
        }
        if ( this.EnableToReserve !== null ) {
          usp.append('enable_to_reserve', this.EnableToReserve.toString());
        }
        if ( this.pagAndOrderFilter !== null ) {
          usp.appendAll( this.pagAndOrderFilter.GetUrlSearchParams() );
        }
        return usp;
    }
}
