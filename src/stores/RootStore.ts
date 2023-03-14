import {
  AuthStore,
  ScreenSizeStore,
  CategoryStore,
  CustomDialogStore,
  CustomDrawerStore,
  ErrorStore,
  LocationStore,
  ReviewStore,
  ThemeStore,
  UserNavigatorStore,
} from 'stores';

export default class RootStore {
  AuthStore: AuthStore = new AuthStore();
  ScreenSizeStore: ScreenSizeStore = new ScreenSizeStore();
  CategoryStore: CategoryStore = new CategoryStore();
  CustomDialogStore: CustomDialogStore = new CustomDialogStore();
  CustomDrawerStore: CustomDrawerStore = new CustomDrawerStore();
  ErrorStore: ErrorStore = new ErrorStore();
  LocationStore: LocationStore = new LocationStore();
  ReviewStore: ReviewStore = new ReviewStore();
  ThemeStore: ThemeStore = new ThemeStore();
  UserNavigatorStore: UserNavigatorStore = new UserNavigatorStore();
}
