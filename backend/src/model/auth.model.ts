import { AksesLevel, Status } from '../../generated/prisma';

export class AuthLoginRequest {
  username: string;
  password: string;
}

export class AuthLoginResponse {
  access_token: string;
  user: AuthUserResponse;
}

export class AuthUserResponse {
  id: string;
  full_name: string;
  username: string;
  email: string;
  access_level: AksesLevel;
  position: string | null;
  phone_number: string | null;
  address: string | null;
  status: Status;
  created_at: Date;
  updated_at: Date;
}

export class AuthChangePasswordRequest {
  old_password: string;
  new_password: string;
}
