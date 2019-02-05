export class Session {
  constructor(public userID: number,
              public username: string,
              public rol: string,
              public jwtToken: string) {}
}
