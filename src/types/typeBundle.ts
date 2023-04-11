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
  type: RequestType;
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
  locations: {
    idx: number;
    name: string;
    places: PlaceDataType[];
  };
}

export interface DrawerStatusType {
  expanded: 'removed' | 'appeared' | 'expanded' | 'full';
}

export interface FavoritePlaceType {
  createdDate: string;
  idx: number;
  place: PlaceDataType;
}

export interface PinnedReviewType {
  createdDate: string;
  idx: number;
  reviewPost: ReviewType;
}

export interface FavoritesType {
  places: FavoritePlaceType[];
}

export interface MyReplyType {
  content: string;
  createdDate: string;
  idx: number;
  reviewPost: Partial<ReviewType>;
  status: string;
  updatedDate: string;
}

export interface ReviewType {
  content: string;
  createdDate: string;
  idx: number;
  pinReviewPostCount: number;
  place: PlaceDataType;
  replyCount: number;
  replies: ReplyType[];
  report: number;
  status: string;
  updatedDate: string;
  view: number;
  writer: WriterType;
  isPin: boolean;
}

export interface ReplyType {
  content: string;
  createdDate: string;
  idx: number;
  level: number;
  levelReplies: RereplyType[];
  mainReplyIdx: number;
  report: number;
  status: string;
  updatedDate: string;
  user: UserType;
}

export interface RereplyType {
  content: string;
  createdDate: string;
  idx: number;
  level: number;
  mainReplyIdx: number;
  report: number;
  status: string;
  updatedDate: string;
  user: UserType;
}

export interface UserType {
  createdDate: string;
  email: string;
  idx: number;
  name: string;
  nickname: string;
  snsId: string;
  snsType: 'KAKAO' | 'NAVER' | 'GOOGLE';
  status: string;
  updatedDate: string;
}

export interface ReviewDetailType {
  content: string;
  createdDate: string;
  idx: number;
  images: string[];
  isPin: boolean;
  pinReviewPostCount: number;
  place: PlaceDataType;
  replies: ReplyType[];
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

export interface NotiDialogOptions {
  title: string;
  content: string;
  subContent?: string;
  leftButton?: { title: string; handleClick: () => void };
  rightButton: { title: string; handleClick: () => void };
}

export type DialogVariantType = 'accident' | 'cctv' | 'noti';

export type StatusType = 'VERY_RELAXATION' | 'RELAXATION' | 'NORMAL' | 'CROWDED' | 'VERY_CROWDED';

export type ScreenType = 'mobile' | 'tablet' | 'pc';

export type RequestType = 'SKT' | 'KT' | 'EXTRA';

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

export type ChipType =
  | '전체'
  | '강변'
  | '봄 나들이'
  | '골목 및 거리'
  | '공원'
  | '궁궐'
  | '마을'
  | '쇼핑몰'
  | '지하철'
  | '테마파크'
  | '해변'
  | '기타 지역';
