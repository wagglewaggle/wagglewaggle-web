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

export type statusType = 'very crowded' | 'crowded' | 'normal' | 'uncrowded' | 'very uncrowded';

export type screenType = 'mobile' | 'tablet' | 'pc';
