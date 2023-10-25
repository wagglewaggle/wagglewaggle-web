import { makeAutoObservable } from 'mobx';
import { AccidentType, CctvType } from 'types/typeBundle';

export class CustomDialogStore {
  open: boolean = false;
  variant: 'intro' | 'accident' | 'cctv' = 'intro';
  accidentList: AccidentType[] = [];
  cctvList: CctvType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOpen = (newStatus: boolean) => {
    this.open = newStatus;
  };

  openAccidentDialog = (newAccidentLists: AccidentType[]) => {
    this.variant = 'accident';
    this.accidentList = newAccidentLists;
    this.open = true;
  };

  openCctvDialog = (newCctvLists: CctvType[]) => {
    this.variant = 'cctv';
    this.cctvList = newCctvLists;
    this.open = true;
  };

  setCctvLists = (newCctvLists: CctvType[]) => {
    this.cctvList = newCctvLists;
  };
}
