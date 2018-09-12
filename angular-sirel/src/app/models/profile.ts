export class Profile {
  constructor(public username: string,
              public name: string,
              public email: string,
              public send_notifications_to_email: boolean) {}
}
