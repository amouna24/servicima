import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from 'src/app/core/services/storage/local-storage.service';
import { TranslationService } from 'src/app/core/services/translation/translation.service';

@Pipe({
  name: 'translation',
  pure: false
})
export class TranslationPipe implements PipeTransform {

  constructor(private translationServ: TranslationService, private locals: LocalStorageService) { }

  transform(key: any): any {
    return this.translationServ.data[key] || key;
  }

}
