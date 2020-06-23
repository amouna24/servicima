import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  applicationId = `5eac544a92809d7cd5dae21f`; // Todo:  get the applicationId from the local storage
  userEmail = `imen.ammar@widigital-group.com`; // Todo: get the userEmail from the local storage
  $connectedUser = new BehaviorSubject(null); // connacted User Data

  constructor(private httpClient: HttpClient) { }

  getUserInfo(): Observable<any> {
    return this.httpClient.get(`${environment.userApiUrl}/getprofileinfos?application_id=${this.applicationId}&email_address=${this.userEmail}`);
  }
}
