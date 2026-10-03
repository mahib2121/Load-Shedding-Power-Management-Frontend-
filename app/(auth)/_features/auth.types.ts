export type UserRole =
  | "CUSTOMER"
  | "FIELD_OPERATOR"
  | "ZONE_MANAGER"
  | "SUPER_ADMIN";

export type UserArea = {
  id: string;
  name: string;
  code: string;
};

export type UserZone = {
  id: string;
  name: string;
  code: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;

  role: UserRole;
  jobType: string | null;

  isActive: boolean;
  areaId: string | null;
  zoneId: string | null;
  area: UserArea | null;
  zone: UserZone | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
