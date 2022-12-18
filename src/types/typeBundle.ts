export interface placeDataType {
  id: number;
  name: string;
  category: string;
  status: statusType;
}

export interface searchWordList {
  id: number;
  word: string;
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

export interface locationDataType {
  idx: number;
  name: string;
  x: number;
  y: number;
  accidents: accidentType[];
}

export type statusType = 'very crowded' | 'crowded' | 'normal' | 'uncrowded' | 'very uncrowded';

export type screenType = 'mobile' | 'tablet' | 'pc';
