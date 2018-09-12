import { User } from '@app/models/user';
import { JwtToken } from '@app/models/jwt-token';

export class Session {
  constructor(public username: string, public rol: string, public jwtToken: string) {}
}
