import {Injectable} from '@angular/core';
import {errors} from './errors-mapping';

@Injectable({
  providedIn: 'root'
})
export class SimpleMessagesProviderService {

  constructor() {}

  public instant(key: string) {
    if (key in errors) {
      return errors[key];
    } else {
      return key;
    }
  }
}