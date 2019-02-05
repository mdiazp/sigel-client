import { URLSearchParams } from '@angular/http';
import { PagAndOrderFilter } from '@app/models/pag-and-order-filter';

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
                public pagAndOrderFilter: PagAndOrderFilter) {}

    GetURLSearchParams(): URLSearchParams {
        let usp: URLSearchParams; usp = new URLSearchParams();
        if ( this.Username !== null  && this.Username !== 'null' && this.Username !== '' ) {
            usp.append('username', this.Username);
        }
        if ( this.Email !== null  && this.Email !== 'null' && this.Email !== '' ) {
            usp.append('email', this.Email);
        }
        if ( this.Name !== null  && this.Name !== 'null' && this.Name !== '' ) {
            usp.append('name', this.Name);
        }
        if ( this.Rol !== null  && this.Rol !== 'null' && this.Rol !== '' ) {
            usp.append('rol', this.Rol);
        }
        if ( this.Enable !== null ) {
            usp.append('enable', this.Enable.toString());
        }
        if ( this.pagAndOrderFilter !== null ) {
            usp.appendAll(this.pagAndOrderFilter.GetUrlSearchParams());
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
