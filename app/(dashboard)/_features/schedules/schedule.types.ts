// All types in this file are derived from the confirmed backend
// `LoadSheddingService` implementation. No fields are guessed.

export type ScheduleStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "ACTIVE";

export type ScheduleZone = {
  id: string;
  name: string;
  code: string;
};

export type ScheduleFeeder = {
  id: string;
  name: string;
  code: string;
  capacityMW?: number;
  currentLoadMW?: number;
  priority?: number;
};

// `ScheduleSlot` is what the service returns. The `feeder` shape
// varies per endpoint (the list response doesn't embed slots; the
// detail and my-schedule endpoints do, with different feeder fields).
// We keep one shared `ScheduleFeeder` type with optional fields.
export type ScheduleSlot = {
  id: string;
  scheduleId: string;
  feederId: string;

  startTime: string;
  endTime: string;

  durationHours: number;
  plannedLoadReductionMW: number;

  feeder: ScheduleFeeder;
};

export type LoadSheddingSchedule = {
  id: string;

  name: string;
  date: string;

  expectedDemandMW: number;
  availableSupplyMW: number;
  requiredReductionMW: number;

  zoneId: string;

  status: ScheduleStatus | string;

  createdAt: string;
  updatedAt: string;

  zone: ScheduleZone;

  _count?: {
    slots: number;
  };

  slots?: ScheduleSlot[];
};

// `ICreateSchedulePayload` — derived from the `createSchedule` service.
// `requiredReductionMW` is server-computed (max(expected - available, 0)),
// so it is intentionally NOT in the client payload.
export type CreateSchedulePayload = {
  name: string;
  date: string;
  zoneId: string;
  expectedDemandMW: number;
  availableSupplyMW: number;
};

export type CreateScheduleResponse = LoadSheddingSchedule;

// `ICreateScheduleSlotPayload` — derived from `createScheduleSlot`.
// `durationHours` is required by the backend and must equal the
// difference between `endTime` and `startTime` in hours (1 or 2).
export type AddSlotPayload = {
  feederId: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  plannedLoadReductionMW: number;
};

export type AddSlotResponse = ScheduleSlot;

// `reject` service takes no payload; status is reset to `DRAFT`.
// We keep the type here in case a reason is later added.
export type RejectSchedulePayload = {
  reason?: string;
};

// `my-schedule` returns ACTIVE schedules with slots filtered to the
// customer's area; slots here only include the slim feeder shape.
export type CustomerSchedule = LoadSheddingSchedule & {
  slots: ScheduleSlot[];
};
