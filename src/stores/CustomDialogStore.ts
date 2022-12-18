import { makeAutoObservable } from 'mobx';
import { accidentType } from 'types/typeBundle';

export class CustomDialogStore {
  open: boolean = false;
  variant: 'intro' | 'accident' | 'cctv' = 'intro';
  accidentList: accidentType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOpen = (newStatus: boolean) => {
    this.open = newStatus;
  };

  openAccidentDialog = (newAccidentLists: accidentType[]) => {
    this.variant = 'accident';
    this.accidentList = newAccidentLists;
    this.open = true;
  };

  openCctvDialog = () => {
    this.variant = 'cctv';
    this.open = true;
  };
}
