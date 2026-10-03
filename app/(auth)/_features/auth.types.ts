export type UserRole =
  | "CUSTOMER"
  | "FIELD_OPERATOR"
  | "ZONE_MANAGER"
  | "SUPER_ADMIN";

export interface UserLocation {
  id: string;
  name: string;
  code: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;

  role: UserRole;
  jobType: string | null;

  isActive: boolean;

  areaId: string | null;
  zoneId: string | null;

  createdAt: string;
  updatedAt: string;

  area: UserLocation | null;
  zone: UserLocation | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
