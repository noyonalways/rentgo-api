import { TCarStatus, TMileageUnit, TTransmission } from "./car.interface";

export const carStatus: TCarStatus[] = ["available", "unavailable"];
export const carTransMission: TTransmission[] = ["automatic", "manual"];
export const carMileageUnit: TMileageUnit[] = ["kilometers", "miles"];

// searchable fields
export const searchableFields = [
  "name",
  "description",
  "model",
  "brand",
  "type",
  "category",
];
