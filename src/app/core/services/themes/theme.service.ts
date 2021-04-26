import { Injectable } from '@angular/core';
import { ITheme } from '@shared/models/theme.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  listColor: ITheme[] = [];
  constructor( private localStorageService: LocalStorageService,
               private utilsService: UtilsService   ) { }
  /**************************************************************************
   * @description get Theme
   * @return list of theme
   *************************************************************************/
  getTheme(): ITheme[] {
    this.listColor = [
      { 'color': 'blackGreen', 'status': false , 'image': 'evenGreen.png'},
      { 'color': 'blueBerry', 'status': false , 'image': 'blueBerry.png'},
      { 'color': 'Default', 'status': false , 'image': 'blue.png'},
      { 'color': 'evenGreen', 'status': false , 'image': 'evenGreen.png'},
      { 'color': 'greenBlue', 'status': false , 'image': 'greenBlue.png'},
      { 'color': 'mango', 'status': false , 'image': 'mango.png'},
      { 'color': 'whiteRed', 'status': false , 'image': 'whiteRed.png'},
      { 'color': 'setting', 'status': false , 'image': 'whiteRed.png'}
    ];
    const cred = this.localStorageService.getItem('userCredentials');
    const email = cred['email_address'];
    if (this.localStorageService.getItem(this.utilsService.hashCode(email))) {
      this.listColor.map(element => {
        if (element.color === this.localStorageService.getItem(this.utilsService.hashCode(email))) {
          element.status = true;
        }
      });
      return this.listColor;
    } else {
      return this.listColor;
    }
  }
}
