import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'spliceText' })
export class SpliceText implements PipeTransform {
  transform(value: string, max): string {
    return value?.length > max ? value.substring(0, max - 4) + '...' : value;
  }
}
