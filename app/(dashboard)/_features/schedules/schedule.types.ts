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

  status: ScheduleStatus;

  createdAt: string;
  updatedAt: string;

  zone: ScheduleZone;

  _count?: {
    slots: number;
  };

  slots?: ScheduleSlot[];
};
