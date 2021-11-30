import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IShareOnSocialNetworkModel } from '@shared/models/shareOnSocialNetwork.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShareOnSocialNetworkService {

  constructor(
    private httpClient: HttpClient,
  ) { }
  /**************************************************************************
   * @description Get linkedinAccess token
   * @param code : code auth given by linkedin
   *************************************************************************/
  getLinkedInAccessToken(code: string): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/accessToken?code=${code}`);
  }
  /**************************************************************************
   * @description Get linkedin Authentication link
   *************************************************************************/
  getLinkedinAuthLink(): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/auth`);
  }
  postOnLinkedin(access_token, id, post, file) {
    console.log('file ====', file);
    return this.httpClient.post<any>(`${environment.linkedInOauthApiUrl}/postOnLinkedin`,
      { post, access_token, id, file});
  }
  getLinkedinId(access_token): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/linkedinId?access_token=${access_token}`);
  }
  getLinkedinEmail(access_token): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/linkedinEmail?access_token=${access_token}`);
  }
  uploadLinkedinImage(access_token, id,  file) {
    return this.httpClient.post<any>(`${environment.linkedInOauthApiUrl}/uploadImage`,
      { access_token, id, file});
  }
  /**************************************************************************
   * @description Get posts List
   * @param filter search query like [ ?id=123 ]
   * @returns All Posts Observable<IShareOnSocialNetworkModel[]>
   *************************************************************************/
  getPosts(filter: string): Observable<IShareOnSocialNetworkModel[]> {
    return this.httpClient.get<IShareOnSocialNetworkModel[]>(`${environment.linkedInOauthApiUrl}/${filter}`);
  }

  /**************************************************************************
   * @description Add new Certification
   * @param post : IShareOnSocialNetworkModel  model
   *************************************************************************/
  addPosts(post: IShareOnSocialNetworkModel): Observable<any> {
    return this.httpClient.post<IShareOnSocialNetworkModel>(`${environment.linkedInOauthApiUrl}`, post);
  }

  /**************************************************************************
   * @description Update posts Status
   * @param post: updated  posts Object
   *************************************************************************/
  updatePosts(post: IShareOnSocialNetworkModel): Observable<any> {
    return this.httpClient.put<IShareOnSocialNetworkModel>(`${environment.linkedInOauthApiUrl}`, post);
  }

  /**************************************************************************
   * @description Delete post Status
   * @param id: Delete post Object
   *************************************************************************/
  deletePosts(id: string): Observable<any> {
    return this.httpClient.delete<IShareOnSocialNetworkModel>(`${environment.linkedInOauthApiUrl}/?_id=${id}`);
  }
  /**************************************************************************
   * @description Get linkedin Authentication link
   *************************************************************************/
  getIndeedAuthLink(): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/indeedAuth`);
  }
  /**************************************************************************
   * @description Get linkedinAccess token
   * @param code : code auth given by linkedin
   *************************************************************************/
  getIndeedAccessToken(code: string): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/indeedAccessToken?code=${code}`);
  }
}
