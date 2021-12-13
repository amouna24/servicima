import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  /**************************************************************************
   * @description Share posts on Linkedin
   * @param access_token: profile access token
   * @param id: profile id
   * @param post: Post data
   * @param file: attached file for shared post
   *************************************************************************/
  postOnLinkedin(access_token, id, post, file) {
    return this.httpClient.post<any>(`${environment.linkedInOauthApiUrl}/postOnLinkedin`,
      { post, access_token, id, file});
  }
  /**************************************************************************
   * @description Get linkedin profile ID
   * @param access_token: profile access token
   *************************************************************************/
  getLinkedinId(access_token): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/linkedinId?access_token=${access_token}`);
  }
  /**************************************************************************
   * @description Get linkedin profile Email
   * @param access_token: profile access token
   *************************************************************************/
  getLinkedinEmail(access_token): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/linkedinEmail?access_token=${access_token}`);
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
   * @description Get Facebook Authentication link
   *************************************************************************/
  getFacebookAuthLink(): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/facebookAuth`);
  }
  /**************************************************************************
   * @description Get Facebook id and access Token
   * @param code : code auth given by Facebook
   *************************************************************************/
  getFacebookId(code: string): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/facebookAccessToken?code=${code}`);
  }
  /**************************************************************************
   * @description Get Facebook needed data for sharing posts on
   * @param access_token: profile access token
   *************************************************************************/
  getFacebookPageData(access_token: string): Observable<any> {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/facebookId?access_token=${access_token}`);
  }
  /**************************************************************************
   * @description Share posts on Facebook Pages
   * @param accessToken: page access token
   * @param id: page id
   * @param post: Post data
   * @param file: attached file for shared post
   *************************************************************************/
  postOnFacebookPage(accessToken, id, post, file) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post<any>(`${environment.linkedInOauthApiUrl}/postOnFacebookPage`,
      { post, accessToken, id, file}, { headers });
  }
  /**************************************************************************
   * @description Get Facebook profile email
   * @param accessToken: profile access token
   * @param id: profile  id
   *************************************************************************/
  getFacebookEmail(accessToken, id) {
    return this.httpClient.get<string>(`${environment.linkedInOauthApiUrl}/facebookEmail?access_token=${accessToken}&id=${id}`);
  }
}
