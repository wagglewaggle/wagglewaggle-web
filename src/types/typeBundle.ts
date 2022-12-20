export interface categoryType {
  idx: number;
  type: string;
}

export interface populationType {
  idx: number;
  level: statusType;
  createdDate: string;
  updatedDate: string;
}

export interface placeDataType {
  idx: number;
  name: string;
  categories: categoryType[];
  poiId: number;
  x: number;
  y: number;
  populations: populationType[];
}

export interface locationInfoType {
  [key: string]: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: [number, number][][] | [number, number][][][];
  };
}

export interface accidentType {
  idx: number;
  type: string;
  dtype: string;
  info: string;
  x: number;
  y: number;
  createdDate: string;
  updatedDate: string;
}

export interface cctvType {
  idx: number;
  src: string;
  cctvname: string;
}

export interface trafficType {
  idx: number;
  avgSpeed: number;
  info: string;
  type: string;
}

export interface locationDataType {
  idx: number;
  name: string;
  x: number;
  y: number;
  populations: populationType[];
  level: statusType;
  accidents: accidentType[];
  cctvs: cctvType[];
  roadTraffic: trafficType;
}

export type statusType = 'VERY_RELAXATION' | 'RELAXATION' | 'NORMAL' | 'CROWDED' | 'VERY_CROWDED';

export type screenType = 'mobile' | 'tablet' | 'pc';
