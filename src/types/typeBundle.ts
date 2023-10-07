export interface CategoryType {
  idx: number;
  type: string;
}

export interface PopulationType {
  idx: number;
  level: StatusType;
  createdDate: string;
  updatedDate: string;
}

export interface PlaceDataType {
  idx: number;
  name: string;
  categories: CategoryType[];
  poiId?: number;
  x: number;
  y: number;
  population?: PopulationType;
}

export interface LocationInfoType {
  [key: string]: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: [number, number][][] | [number, number][][][];
  };
}

export interface AccidentType {
  idx: number;
  type: string;
  dtype: string;
  info: string;
  x: number;
  y: number;
  createdDate: string;
  updatedDate: string;
}

export interface CctvType {
  idx: number;
  src: string;
  cctvname: string;
}

export interface TrafficType {
  idx: number;
  avgSpeed: number;
  info: string;
  type: string;
}

export interface LocationDataType {
  idx: number;
  name: string;
  x: number;
  y: number;
  population: PopulationType;
  level: StatusType;
  accidents: AccidentType[];
  cctvs: CctvType[];
  roadTraffic: TrafficType;
  locations?: {
    ktPlaces?: PlaceDataType[];
    sktPlaces?: PlaceDataType[];
  };
}

export type StatusType = 'VERY_RELAXATION' | 'RELAXATION' | 'NORMAL' | 'CROWDED' | 'VERY_CROWDED';

export type ScreenType = 'mobile' | 'tablet' | 'pc';

export type BgType =
  | 'AmusementPark'
  | 'Department'
  | 'GwangHwa'
  | 'HanRiver'
  | 'Palace'
  | 'Park'
  | 'Street'
  | 'Subway'
  | 'Tradition'
  | 'BlueHouse'
  | 'Firework';
