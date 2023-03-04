import {
  ScreenSizeStore,
  CustomDialogStore,
  CustomDrawerStore,
  ErrorStore,
  LocationStore,
  ThemeStore,
  UserNavigatorStore,
} from 'stores';

export default class RootStore {
  ScreenSizeStore: ScreenSizeStore = new ScreenSizeStore();
  CustomDialogStore: CustomDialogStore = new CustomDialogStore();
  CustomDrawerStore: CustomDrawerStore = new CustomDrawerStore();
  ErrorStore: ErrorStore = new ErrorStore();
  LocationStore: LocationStore = new LocationStore();
  ThemeStore: ThemeStore = new ThemeStore();
  UserNavigatorStore: UserNavigatorStore = new UserNavigatorStore();
}
