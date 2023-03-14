import { makeAutoObservable } from 'mobx';
import { DrawerStatusType, PlaceDataType } from 'types/typeBundle';

export class CustomDrawerStore {
  open: boolean = false;
  variant: 'map' | 'list' = 'map';
  drawerComponent: JSX.Element | null = null;
  titleTag: HTMLTitleElement | null = document.querySelector('title');
  searchValue: string = '';
  placeData: PlaceDataType[] = [];
  includesInputBox: boolean = true;
  drawerStatus: DrawerStatusType = { expanded: 'removed', dragHeight: 0 };
  rndResizerFunctionConfig: { currentKey: string | null; functionProps: unknown | null } = {
    currentKey: null,
    functionProps: null,
  };

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
    this.setDrawerStatus({ expanded: 'removed' });
  };

  setVariant = (newVariant: 'map' | 'list') => {
    this.variant = newVariant;
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

  setDrawerStatus = (newStatus: Partial<DrawerStatusType>) => {
    this.drawerStatus = { ...this.drawerStatus, ...newStatus };
  };

  initRndResizerFunctionConfig = () => {
    this.rndResizerFunctionConfig = {
      currentKey: null,
      functionProps: null,
    };
  };

  setRndResizerFunctionConfig = (key: string, props?: unknown) => {
    this.rndResizerFunctionConfig = { currentKey: key, functionProps: props ?? null };
  };
}
