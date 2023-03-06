import {
  AuthStore,
  ScreenSizeStore,
  CustomDialogStore,
  CustomDrawerStore,
  ErrorStore,
  LocationStore,
  ThemeStore,
  UserNavigatorStore,
} from 'stores';

export default class RootStore {
  AuthStore: AuthStore = new AuthStore();
  ScreenSizeStore: ScreenSizeStore = new ScreenSizeStore();
  CustomDialogStore: CustomDialogStore = new CustomDialogStore();
  CustomDrawerStore: CustomDrawerStore = new CustomDrawerStore();
  ErrorStore: ErrorStore = new ErrorStore();
  LocationStore: LocationStore = new LocationStore();
  ThemeStore: ThemeStore = new ThemeStore();
  UserNavigatorStore: UserNavigatorStore = new UserNavigatorStore();
}
