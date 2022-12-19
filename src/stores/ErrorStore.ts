import { makeAutoObservable } from 'mobx';

export class ErrorStore {
  statusCode: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setStatusCode = (newStatusCode: number | null) => {
    this.statusCode = newStatusCode;
  };
}
