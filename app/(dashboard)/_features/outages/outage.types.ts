// export type CreateOutageReportPayload = {
//   description?: string;
//   latitude?: number;
//   longitude?: number;
// };

// export type OutageReport = {
//   id: string;
//   userId: string;
//   areaId: string;
//   description?: string | null;
//   latitude?: number | null;
//   longitude?: number | null;
//   createdAt: string;
//   updatedAt: string;
// };

// export type OutagePayment = {
//   id: string;
//   amount: number;
//   currency: string;
//   status: string;
//   userId: string;
//   outageReportId: string;
//   createdAt: string;
//   updatedAt: string;
// };

// export type OutageArea = {
//   id: string;
//   name: string;
//   code: string;
// };

// export type CreateOutageReportResponse = {
//   report: OutageReport;
//   payment: OutagePayment;
//   area: OutageArea;
//   serviceFee: number;
//   currency: string;
// };

// export type MyOutageReportPayment = {
//   id: string;
//   amount: number;
//   currency: string;
//   status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | string;
//   createdAt?: string;
// };

// export type MyOutageReportArea = {
//   id: string;
//   name: string;
//   code?: string;
// };

// export type MyOutageReportFeeder = {
//   id: string;
//   name: string;
//   code?: string;
// };

// export type MyOutageReportOutage = {
//   id: string;
//   status: string;
//   createdAt?: string;
//   updatedAt?: string;
//   startedAt?: string | null;
//   restoredAt?: string | null;
// };

// export type MyOutageReport = {
//   id: string;
//   description?: string | null;
//   latitude?: number | null;
//   longitude?: number | null;
//   createdAt: string;
//   updatedAt?: string;
//   area?: MyOutageReportArea | null;
//   feeder?: MyOutageReportFeeder | null;
//   payment?: MyOutageReportPayment | null;
//   outage?: MyOutageReportOutage | null;
// };

// export type OperationalOutageStatus =
//   | "REPORTED"
//   | "VERIFIED"
//   | "ASSIGNED"
//   | "IN_PROGRESS"
//   | "RESTORED"
//   | "REJECTED";

// export type OperationalOutage = {
//   id: string;
//   status: OperationalOutageStatus | string;
//   createdAt: string;
//   updatedAt?: string;

//   area?: {
//     id: string;
//     name: string;
//     code?: string;
//   } | null;

//   feeder?: {
//     id: string;
//     name: string;
//     code?: string;
//   } | null;

//   zone?: {
//     id: string;
//     name: string;
//     code?: string;
//   } | null;

//   assignments?: Array<{
//     id: string;
//     status: string;
//     technician?: {
//       id: string;
//       name: string;
//     } | null;
//   }>;

//   _count?: {
//     reports?: number;
//   };
// };

export type OutageStatus =
  | "REPORTED"
  | "VERIFIED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESTORED"
  | "REJECTED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

// Create outage report

export type CreateOutageReportPayload = {
  description?: string;
  latitude?: number;
  longitude?: number;
};

export type OutageReport = {
  id: string;
  userId: string;
  areaId: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type OutagePayment = {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus | string;
  userId: string;
  outageReportId: string;
  createdAt: string;
  updatedAt: string;
};

export type OutageArea = {
  id: string;
  name: string;
  code: string;
};

export type CreateOutageReportResponse = {
  report: OutageReport;
  payment: OutagePayment;
  area: OutageArea;
  serviceFee: number;
  currency: string;
};

// Shared location types

export type OutageAreaSummary = {
  id: string;
  name: string;
  code?: string;
};

export type OutageFeederSummary = {
  id: string;
  name: string;
  code?: string;
};

export type OutageZoneSummary = {
  id: string;
  name: string;
  code?: string;
};

// Customer outage report history

export type MyOutageReportPayment = {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus | string;
  createdAt?: string;
};

export type MyOutageReportOutage = {
  id: string;
  status: OutageStatus | string;
  createdAt?: string;
  updatedAt?: string;
  startedAt?: string | null;
  restoredAt?: string | null;
};

export type MyOutageReport = {
  id: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt?: string;
  area?: OutageAreaSummary | null;
  feeder?: OutageFeederSummary | null;
  payment?: MyOutageReportPayment | null;
  outage?: MyOutageReportOutage | null;
};

// Operational outage list

export type OutageTechnicianSummary = {
  id: string;
  name: string;
  email?: string;
};

export type OutageAssignmentSummary = {
  id: string;
  status: AssignmentStatus | string;
  technician?: OutageTechnicianSummary | null;
};

export type OperationalOutage = {
  id: string;
  status: OutageStatus | string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt?: string;
  area?: OutageAreaSummary | null;
  feeder?: OutageFeederSummary | null;
  zone?: OutageZoneSummary | null;
  assignments?: OutageAssignmentSummary[];
  _count?: {
    reports?: number;
  };
};

// Outage detail

export type OutageDetailSubstation = {
  id: string;
  name: string;
};

export type OutageDetailFeeder = OutageFeederSummary & {
  substation?: OutageDetailSubstation | null;
};

export type OutageDetailReporter = {
  id: string;
  name: string;
  email?: string;
};

export type OutageDetailReport = {
  id: string;
  description?: string | null;
  createdAt: string;
  reporter?: OutageDetailReporter | null;
};

export type OutageDetailAssignment = {
  id: string;
  status: AssignmentStatus | string;
  notes?: string | null;
  assignedAt?: string;
  acceptedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  technician?: OutageTechnicianSummary & {
    phone?: string | null;
  };
};

export type OutageDetail = {
  id: string;
  status: OutageStatus | string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt?: string;
  verifiedAt?: string | null;
  startedAt?: string | null;
  restoredAt?: string | null;
  area?: OutageAreaSummary | null;
  feeder?: OutageDetailFeeder | null;
  zone?: OutageZoneSummary | null;
  reports?: OutageDetailReport[];
  assignments?: OutageDetailAssignment[];
};

// Assign technician

export type AssignTechnicianPayload = {
  technicianId: string;
  notes?: string;
};
