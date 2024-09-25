export type TCarStatus = "available" | "unavailable";

export type TGalleryImage = {
  url: string;
};

export type TMileageUnit = "miles" | "kilometers";

export type TTransmission = "automatic" | "manual";

export type TCar = {
  name: string;
  description: string;
  image: string;
  brand: string;
  model: string;
  type: string;
  category: string;
  year: string;
  color: string;
  seatCapacity: number;
  mileage: number;
  mileageUnit: TMileageUnit;
  galleryImages: TGalleryImage[];
  isElectric: boolean;
  features: string[];
  pricePerHour: number;
  status: TCarStatus;
  transmission: TTransmission;
  isDeleted: boolean;
};
