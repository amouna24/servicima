import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private httpClient: HttpClient) { }


  changePassword(User) {
    return this.httpClient
      .put(environment.credentialsApiURL + '/updatepassword' , User);
  }

}
