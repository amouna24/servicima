import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LocalStorageService } from '../storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo;
  userCredentials: string;
  connectedUser$ = new BehaviorSubject(null);
  company$ = new Subject();

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
  }

   /**
    * @description get user info
    */
    getUserInfo() {
     this.userCredentials = this.localStorageService.getItem('userCredentials');
     // tslint:disable-next-line:max-line-length
       this.httpClient.get(`${environment.getUserInfosApiUrl}?application_id=${this.userCredentials['application_id']}&email_address=${this.userCredentials['email_address']}`)
       .subscribe((data) => {
            this.userInfo = data;
            this.connectedUser$.next(data);
            this.company$.next(data['company'][0]);
       });
      }
  }
