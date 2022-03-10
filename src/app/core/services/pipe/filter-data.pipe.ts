import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterData'
})
export class FilterDataPipe implements PipeTransform {

  transform(list: any[], filters: string, filterField: string) {
    if (filters && filters.length !== 0) {
      const objectKeysArray = filterField.split('.');
      return list.filter( (data) => {
        let selectField = data;
        objectKeysArray.map( (key) => {
          selectField = selectField[key];
        });
        return selectField.toLowerCase().includes(filters.toLowerCase());
      });
    } else {
      return list;
    }

  }

}
