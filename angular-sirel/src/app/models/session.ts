export class Session {
  constructor(public username: string,
              public rol: string,
              public jwtToken: string) {}
}
