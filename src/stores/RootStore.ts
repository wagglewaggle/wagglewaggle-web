import { ScreenSizeStore, CustomDialogStore } from 'stores';

export default class RootStore {
  ScreenSizeStore: ScreenSizeStore = new ScreenSizeStore();
  CustomDialogStore: CustomDialogStore = new CustomDialogStore();
}
