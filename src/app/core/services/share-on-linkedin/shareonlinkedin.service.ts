import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostLinkedinService {

  constructor(
    private httpClient: HttpClient,
  ) { }
  /**************************************************************************
   * @description Get linkedinAccess token
   * @param code : code auth given by linkedin
   *************************************************************************/
  getLinkedInAccessToken(code: string): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}callback/?code=${code}`);
  }
  /**************************************************************************
   * @description Get linkedin Authentication link
   * @param code : code auth given by linkedin
   *************************************************************************/
  getLinkedinAuthLink(): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}auth`);
  }
  postOnLinkedin(access_token, id, post) {
    return this.httpClient.post<any>(`${environment.linkedInOauthApiUrl}publish`,
      { post, access_token, id});
  }
  getLinkedinId(access_token): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}?access_token=${access_token}`);
  }
  uploadLinkedinImage(access_token, id, object) {
    console.log('form', object);
    return this.httpClient.post<any>(`${environment.linkedInOauthApiUrl}upload?access_token=${access_token}&id=${id}`,
      object
      );
  }

}
