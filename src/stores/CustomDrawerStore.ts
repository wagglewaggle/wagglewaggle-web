import { makeAutoObservable } from 'mobx';
import { PlaceDataType } from 'types/typeBundle';

export class CustomDrawerStore {
  open: boolean = false;
  variant: 'map' | 'list' = 'map';
  drawerComponent: JSX.Element | null = null;
  titleTag: HTMLTitleElement | null = document.querySelector('title');
  searchValue: string = '';
  placeData: PlaceDataType[] = [];
  includesInputBox: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  openDrawer = (variant: 'map' | 'list', component: JSX.Element) => {
    this.open = true;
    this.variant = variant;
    this.drawerComponent = component;
  };

  closeDrawer = () => {
    this.open = false;
    this.drawerComponent = null;
  };

  setTitle = (title: string) => {
    if (!this.titleTag) return;
    this.titleTag.innerHTML = title;
  };

  setSearchValue = (searchValue: string) => {
    this.searchValue = searchValue;
  };

  setPlaceData = (newPlaces: PlaceDataType[]) => {
    this.placeData = newPlaces;
  };

  setIncludesInput = (newInputStatus: boolean) => {
    this.includesInputBox = newInputStatus;
  };
}
