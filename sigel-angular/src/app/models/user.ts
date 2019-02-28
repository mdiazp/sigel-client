import { URLSearchParams } from '@angular/http';
import { PagAndOrderFilter, Paginator, OrderBy } from '@app/models/pag-and-order-filter';
import { isNullOrUndefined } from 'util';

export class User {
    constructor(public ID: number,
                public Username: string,
                public Name: string,
                public Email: string,
                public SendNotificationsToEmail: boolean,
                public Rol: string,
                public Enable: boolean) {}
}

export class UserFilter {
    constructor(public Username: string,
                public Name: string,
                public Email: string,
                public Rol: string,
                public Enable: boolean,
                public paginator: Paginator,
                public orderby: OrderBy) {}

    GetURLSearchParams(): URLSearchParams {
        let usp: URLSearchParams; usp = new URLSearchParams();
        if ( !isNullOrUndefined(this.Username)  && this.Username !== 'null' && this.Username !== '' ) {
            usp.append('username', this.Username);
        }
        if ( !isNullOrUndefined(this.Email)  && this.Email !== 'null' && this.Email !== '' ) {
            usp.append('email', this.Email);
        }
        if ( !isNullOrUndefined(this.Name)  && this.Name !== 'null' && this.Name !== '' ) {
            usp.append('name', this.Name);
        }
        if ( !isNullOrUndefined(this.Rol) && this.Rol !== 'null' && this.Rol !== '' ) {
            usp.append('rol', this.Rol);
        }
        if ( !isNullOrUndefined(this.Enable) ) {
            usp.append('enable', this.Enable.toString());
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

export class EditUser {
    constructor(public Rol: string,
                public Enable: boolean) {}
}

export class UserProfile {
    constructor(public ID: number,
                public Username: string,
                public Name: string,
                public Email: string,
                public SendNotificationsToEmail: boolean,
                ) {}
}

export class EditUserProfile {
    constructor(public Email: string,
                public SendNotificationsToEmail: boolean) {}
}

export class UserPublicInfo {
    constructor(public ID: number,
                public Username: string) {}
}
