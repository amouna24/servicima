import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  difference(array1: any[], array2: any[], iterator: any): any[] {
    return _.differenceBy(array1, array2, iterator);
  }

  removeSubArrayFromArray(parentArray: any[], childArray: any[], key: string) {
    _.remove(parentArray, (element) => {
      return childArray.includes(element);
    });
  }

}
