export class User {
    constructor(public id: number,
                public username: string,
                public name: string,
                public email: string,
                public send_notifications_to_email: boolean,
                public rol: string,
                public enable: boolean) {}
}
