import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserInfo } from 'src/app/shared/model/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }
  userToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoid2FsaWQudGVubmljaGVAd2lkaWdpdGFsLWdyb3VwLmNvbS'+
  'IsImlhdCI6MTU5MTA5Mjk2MywiZXhwIjoxNTkxMTc5MzYzfQ.hIZQgg3HQzisfEW21mBKPwipLYp66y-HTSPU4cLvMV4'

  getUser() {

    const header = new HttpHeaders().set('Authorization', `Bearer ${ this.userToken }`
    );
    
    return this.httpClient
      .get<UserInfo>(environment.getUserInfosApiUrl + '?application_id=5eac544a92809d7cd5dae21f' +
        '&email_adress=walid.tenniche@widigital-group.com' , {headers:header});
  }

  updateUser(User) {
    return this.httpClient
      .put(environment.userApiUrl, User);
  }



}
