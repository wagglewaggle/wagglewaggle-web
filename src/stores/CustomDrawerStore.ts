import { makeAutoObservable } from 'mobx';
import { DrawerStatusType } from 'types/typeBundle';

export class CustomDrawerStore {
  open: boolean = false;
  variant: 'map' | 'list' = 'map';
  drawerComponent: JSX.Element | null = null;
  titleTag: HTMLTitleElement | null = document.querySelector('title');
  searchValue: string = '';
  includesInputBox: boolean = false;
  drawerStatus: DrawerStatusType = { expanded: 'removed' };

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
    this.includesInputBox = false;
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

  setIncludesInput = (newInputStatus: boolean) => {
    this.includesInputBox = newInputStatus;
  };

  setDrawerStatus = (newStatus: Partial<DrawerStatusType>) => {
    this.drawerStatus = { ...this.drawerStatus, ...newStatus };
  };
}
