export interface placeDataType {
  id: number;
  name: string;
  category: string;
  status: string;
}

export interface searchWordList {
  id: number;
  word: string;
}

export type pageType = 'main' | 'search' | 'suggestion' | 'result';
