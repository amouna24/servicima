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
  postOnLinkedin(post, access_token, id) {
    return this.httpClient.post<any>(`${environment.linkedInOauthApiUrl}publish`,
      { post, access_token, id});
  }
  getLinkedinId(access_token): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}?access_token=${access_token}`);
  }
  uploadLinkedinImage(access_token, id, file) {
    return this.httpClient.post<any>(`https://api.linkedin.com/v2/assets?action=registerUpload`,
      file, {
      headers: {
        Authorization: 'Bearer ' + access_token,
          'Content-Type': 'multipart/form-data'
      }
      });
  }
}
