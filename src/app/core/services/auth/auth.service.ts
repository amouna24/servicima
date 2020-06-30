import { Injectable } from '@angular/core';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userCredentials: string;
  applicationId: string;
  userEmail: string;
  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
   }

 /**
  * @description Call api credentials to remove fingerprint
  */
  logout() {
    const credentials = {
    application_id:  this.localStorageService.getItem('userCredentials')['application_id'],
    email_address: this.localStorageService.getItem('userCredentials')['email_address'],
    finger_print: ''
    };
    return  this.httpClient.put(`${environment.credentialsApiUrl}/logout`,
     credentials);
  }
}
