import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMessageCodeModel } from '@shared/models/messageCode.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private httpClient: HttpClient) { }

  changePassword(user: object): Observable<IMessageCodeModel> {
    return this.httpClient
      .put<IMessageCodeModel>(`${environment.credentialsApiUrl}'/updatepassword` , user);
  }
}
