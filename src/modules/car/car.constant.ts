import { TCarStatus, TMileageUnit, TTransmission } from "./car.interface";

export const CarStatus: TCarStatus[] = ["available", "unavailable"];
export const CarTransMission: TTransmission[] = ["automatic", "manual"];
export const CarMileageUnit: TMileageUnit[] = ["kilometers", "miles"];

// searchable fields
export const searchableFields = [
  "name",
  "description",
  "model",
  "brand",
  "type",
  "category",
  "color",
];
