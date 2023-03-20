import { makeAutoObservable } from 'mobx';
import { AccidentType, CctvType, DialogVariantType, NotiDialogOptions } from 'types/typeBundle';

export class CustomDialogStore {
  open: boolean = false;
  variant: DialogVariantType = 'intro';
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

  setOpen = (newStatus: boolean) => {
    this.open = newStatus;
    if (!this.open) {
      this.accidentList = [];
      this.cctvList = [];
      this.notiOptions = {
        title: '',
        content: '',
        rightButton: { title: '', handleClick: () => {} },
      };
    }
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

  openNotificationDialog = (options: NotiDialogOptions) => {
    this.variant = 'noti';
    this.open = true;
    this.notiOptions = options;
  };
}
