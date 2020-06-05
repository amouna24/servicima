import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserInfo } from 'src/app/shared/model/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }
  userToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoid2FsaWQudGVubmljaGVAd2lkaWdpdGFsLWdyb3VwLmNvbSIsImlhd'+
  'CI6MTU5MTI4ODc1MSwiZXhwIjoxNTkxMzc1MTUxfQ.w_lt9jUMHpmfwqp4mlLNqX0oLcYNO6-QMRUU_avXs50'

  getUser() {

    const header = new HttpHeaders().set('Authorization', `Bearer ${ this.userToken }`
    );
    
    return this.httpClient
      .get<UserInfo>(environment.getUserInfosApiUrl + '?application_id=5eac544a92809d7cd5dae21f' +
        '&email_adress=walid.tenniche@widigital-group.com' , {headers:header});
  }

  updateUser(User) {
    const header = new HttpHeaders().set('Authorization', `Bearer ${ this.userToken }`
    );
    return this.httpClient
      .put(environment.userApiUrl, User ,{headers:header});
  }



}
