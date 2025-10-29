export interface User {
  id: string;
  vorname: string;
  name: string;
  email: string;
  rolle: UserRole;
  contactPermission?: boolean;
  secondFactorType?: SecondFactorType;
}

export enum UserRole {
  Guest = 'Guest',
  Administrator = 'Administrator',
  Kunde = 'Kunde'
}

export enum SecondFactorType {
  OTP = 'otp',
  EMAIL = 'email'
}
