import {
  AuthStore,
  ScreenSizeStore,
  CategoryStore,
  CustomDialogStore,
  CustomDrawerStore,
  AxiosStore,
  LocationStore,
  ReviewStore,
  ThemeStore,
  UserNavigatorStore,
  ProfileStore,
} from 'stores';

export default class RootStore {
  AuthStore: AuthStore = new AuthStore();
  ScreenSizeStore: ScreenSizeStore = new ScreenSizeStore();
  CategoryStore: CategoryStore = new CategoryStore();
  CustomDialogStore: CustomDialogStore = new CustomDialogStore();
  CustomDrawerStore: CustomDrawerStore = new CustomDrawerStore();
  AxiosStore: AxiosStore = new AxiosStore();
  LocationStore: LocationStore = new LocationStore();
  ReviewStore: ReviewStore = new ReviewStore();
  ThemeStore: ThemeStore = new ThemeStore();
  UserNavigatorStore: UserNavigatorStore = new UserNavigatorStore();
  ProfileStore: ProfileStore = new ProfileStore();
}
