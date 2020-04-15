import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation/translation.service';

@Pipe({
  name: 'translation',
  pure: false
})
export class TranslationPipe implements PipeTransform {

  constructor(private translationServ: TranslationService) {}

  transform(key: any): any {
    return this.translationServ.data[key] || key;
  }


}
