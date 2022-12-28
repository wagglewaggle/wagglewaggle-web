import { ScreenSizeStore, CustomDialogStore, ErrorStore, LocationStore, ThemeStore } from 'stores';

export default class RootStore {
  ScreenSizeStore: ScreenSizeStore = new ScreenSizeStore();
  CustomDialogStore: CustomDialogStore = new CustomDialogStore();
  ErrorStore: ErrorStore = new ErrorStore();
  LocationStore: LocationStore = new LocationStore();
  ThemeStore: ThemeStore = new ThemeStore();
}
