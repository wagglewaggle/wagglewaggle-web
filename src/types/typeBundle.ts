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
  type: string;
  categories: CategoryType[];
  poiId: number;
  x: number;
  y: number;
  reviewPostCount: number;
  pinPlaceCount: number;
  cctvCount?: number;
  population: PopulationType;
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
  address: string;
  pinPlaceCount: number;
  reviewPostCount: number;
}

export interface DrawerStatusType {
  expanded: 'removed' | 'appeared' | 'expanded' | 'full';
  dragHeight: number;
}

export interface FavoritePlaceType {
  createdDate: string;
  idx: number;
  place: PlaceDataType;
}

export interface FavoritesType {
  places: FavoritePlaceType[];
}

export interface ReviewType {
  content: string;
  createdDate: string;
  idx: number;
  pinReviewPostCount: number;
  place: PlaceDataType;
  replyCount: number;
  report: number;
  status: string;
  updatedDate: string;
  view: number;
  writer: WriterType;
  isPin: boolean;
}

export interface ReviewDetailType {
  content: string;
  createdDate: string;
  idx: number;
  images: string[];
  isPin: boolean;
  pinReviewPostCount: number;
  place: PlaceDataType;
  replies: string[];
  replyCount: number;
  report: number;
  status: string;
  updatedDate: string;
  view: number;
  writer: WriterType;
}

interface WriterType {
  createdDate: string;
  updatedDate: string;
  email: string;
  idx: number;
  name: string;
  nickname: string;
  snsId: string;
  snsType: 'KAKAO' | 'NAVER' | 'GOOGLE';
  status: string;
}

export type StatusType = 'VERY_RELAXATION' | 'RELAXATION' | 'NORMAL' | 'CROWDED' | 'VERY_CROWDED';

export type ScreenType = 'mobile' | 'tablet' | 'pc';

export type BgType =
  | 'AmusementPark'
  | 'Department'
  | 'GwangHwa'
  | 'HanRiver'
  | 'Namsan'
  | 'Palace'
  | 'Park'
  | 'Street'
  | 'Subway'
  | 'Tradition';
