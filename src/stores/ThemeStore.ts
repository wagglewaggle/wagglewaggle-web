import { makeAutoObservable } from 'mobx';

export class ThemeStore {
  theme: 'dark' | 'light' = 'dark';

  constructor() {
    makeAutoObservable(this);
  }

  setTheme = (newTheme: 'dark' | 'light') => {
    this.theme = newTheme;
  };
}
