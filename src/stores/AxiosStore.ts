import { makeAutoObservable } from 'mobx';

export class AxiosStore {
  statusCode: number | null = null;
  requestInProgress: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setStatusCode = (newStatusCode: number | null) => {
    this.statusCode = newStatusCode;
  };

  setRequestInProgress = (newStatus: boolean) => {
    this.requestInProgress = newStatus;
  };
}
