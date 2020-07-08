import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private httpClient: HttpClient) { }

  changePassword(user: object) {
    return this.httpClient
      .put(`${environment.credentialsApiUrl}'/updatepassword` , user);
  }

}
