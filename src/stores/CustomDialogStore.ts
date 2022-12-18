import { makeAutoObservable } from 'mobx';
import { accidentType } from 'types/typeBundle';

export class CustomDialogStore {
  open: boolean = false;
  variant: 'intro' | 'accident' | 'cctv' = 'intro';
  accidentList: accidentType[] = [];
  cctvList: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOpen = (newStatus: boolean) => {
    this.open = newStatus;
    if (!this.open) {
      this.accidentList = [];
      this.cctvList = [];
    }
  };

  openAccidentDialog = (newAccidentLists: accidentType[]) => {
    this.variant = 'accident';
    this.accidentList = newAccidentLists;
    this.open = true;
  };

  openCctvDialog = (newCctvLists: string[]) => {
    this.variant = 'cctv';
    this.cctvList = newCctvLists;
    this.open = true;
  };
}
