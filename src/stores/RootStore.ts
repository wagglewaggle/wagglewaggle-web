import { ScreenSizeStore, CustomDialogStore, ErrorStore } from 'stores';

export default class RootStore {
  ScreenSizeStore: ScreenSizeStore = new ScreenSizeStore();
  CustomDialogStore: CustomDialogStore = new CustomDialogStore();
  ErrorStore: ErrorStore = new ErrorStore();
}
