import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserModel } from '@shared/models/user.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) { }
  userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoid2FsaWQudGVubmljaGVAd2lkaWdpdGFsLWdyb3VwLmNvbSIsImlh' +
    'dCI6MTU5MTYwMTc3NiwiZXhwIjoxNTkxNjg4MTc2fQ.g5xFl0RUl5ouoCEyd7d7T4gd1D8X0tHzMG-XYvkRUwg';

  getUser() {

    const header = new HttpHeaders().set('Authorization', `Bearer ${this.userToken}`
    );

    return this.httpClient
      .get<IUserInfo>(environment.userInfoApiUrl + '?application_id=5eac544a92809d7cd5dae21f' +
        '&email_adress=walid.tenniche@widigital-group.com', { headers: header });
  }

  getAllUser() {

    const header = new HttpHeaders().set('Authorization', `Bearer ${this.userToken}`
    );

    return this.httpClient
      .get<IUserModel[]>(environment.userApiUrl, { headers: header });
  }

  updateUser(User) {
    const header = new HttpHeaders().set('Authorization', `Bearer ${this.userToken}`
    );
    return this.httpClient
      .put(environment.userApiUrl, User, { headers: header });
  }

}
