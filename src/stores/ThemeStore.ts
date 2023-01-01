import { makeAutoObservable } from 'mobx';

export class ThemeStore {
  theme: 'dark' | 'light' = 'light';

  constructor() {
    makeAutoObservable(this);
  }

  setTheme = (newTheme: 'dark' | 'light') => {
    this.theme = newTheme;
  };
}
