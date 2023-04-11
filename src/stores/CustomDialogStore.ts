import { makeAutoObservable } from 'mobx';
import { AccidentType, CctvType, DialogVariantType, NotiDialogOptions } from 'types/typeBundle';

export class CustomDialogStore {
  open: boolean = false;
  openTimeout?: NodeJS.Timeout;
  variant: DialogVariantType = 'noti';
  accidentList: AccidentType[] = [];
  cctvList: CctvType[] = [];
  notiOptions: NotiDialogOptions = {
    title: '',
    content: '',
    rightButton: { title: '', handleClick: () => {} },
  };

  constructor() {
    makeAutoObservable(this);
  }

  clearTimeout = () => {
    if (this.open && this.openTimeout) {
      clearTimeout(this.openTimeout);
    }
  };

  initVariables = () => {
    this.accidentList = [];
    this.cctvList = [];
    this.notiOptions = {
      title: '',
      content: '',
      rightButton: { title: '', handleClick: () => {} },
    };
  };

  setOpen = (newStatus: boolean) => {
    this.open = newStatus;
    if (!this.open) {
      this.openTimeout = setTimeout(this.initVariables, 1000);
    }
  };

  openAccidentDialog = (newAccidentLists: AccidentType[]) => {
    this.variant = 'accident';
    this.accidentList = newAccidentLists;
    this.open = true;
    this.clearTimeout();
  };

  openCctvDialog = (newCctvLists: CctvType[]) => {
    this.variant = 'cctv';
    this.cctvList = newCctvLists;
    this.open = true;
    this.clearTimeout();
  };

  openNotificationDialog = (options: NotiDialogOptions) => {
    this.variant = 'noti';
    this.open = true;
    this.notiOptions = options;
    this.clearTimeout();
  };
}
