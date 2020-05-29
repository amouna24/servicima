import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }


  getUser() {
    return this.httpClient
      .get(environment.getUserInfosApiUrl + '?application_id=5eac544a92809d7cd5dae21f' +
        '&email_adress=walid.tenniche@widigital-group.com');
  }

  updateUser(User) {
    return this.httpClient
      .put(environment.userApiUrl, User);
  }



}
