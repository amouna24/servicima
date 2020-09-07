import { Injectable } from '@angular/core';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMessageCodeModel } from '@shared/models/messageCode.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient,
              private localStorageService: LocalStorageService, ) {
   }

 /**
  * @description Call api credentials to remove fingerprint
  */
  logout(): Observable<IMessageCodeModel> {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    const credentials = {
      application_id: userCredentials['application_id'],
      email_address: userCredentials['email_address'],
      finger_print: ''
    };
    return  this.httpClient.put<IMessageCodeModel>(`${environment.credentialsApiUrl}/logout`,
     credentials);
  }
}
