import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { IUserInfo } from '@shared/models/userInfo.model';
import { ICompanyModel } from '@shared/models/company.model';
import { IActivity } from '@shared/models/activity.model';
import { IApplicationModel } from '@shared/models/application.model';
import { ILanguageModel } from '@shared/models/language.model';
import { ILicenceModel } from '@shared/models/licence.model';
import { ICountry } from '@shared/models/countries.model';
import { IUserModel } from '@shared/models/user.model';

import { LocalStorageService } from '../storage/local-storage.service';
import { AppInitializerService } from '../app-initializer/app-initializer.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userInfo: IUserInfo;
  applicationId: string;
  refresh: boolean;
  emailAddress: string;
  language: any;
  companyList: ICompanyModel[];
  activityCodeList: IActivity[];
  countriesList: ICountry[];
  applicationList: IApplicationModel[];
  languageList: ILanguageModel[];
  licenceList: ILicenceModel[];
  moduleName$ = new BehaviorSubject<string>(null);
  connectedUser$ = new BehaviorSubject<IUserInfo>(null);
  redirected = false;
  colorSubject$ = new Subject<string>();
  classSubject$ = new Subject<object>();
  haveImage$ = new Subject<string>();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoadingAction$ = this.isLoadingSubject.asObservable();
  avatar$ = new BehaviorSubject<any>(null);
  userType: string;
  companyRolesFeatures = [];
  licenceFeature: string[];
  constructor(private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private appInitializerService: AppInitializerService,
  ) {
    this.getDataFromLocalStorage();
    this.setupData();
  }

  /**************************************************************************
   * @description Setup data
   *************************************************************************/
  setupData(): void {
    this.companyList = this.appInitializerService.companyList;
    this.countriesList = this.appInitializerService.countriesList;
    this.activityCodeList = this.appInitializerService.activityCodeList;
    this.languageList = this.appInitializerService.languageList;
    this.applicationList = this.appInitializerService.applicationList;
    this.licenceList = this.appInitializerService.licencesList;
  }

  /**************************************************************************
   * @description get data from local storage
   *************************************************************************/
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
    this.emailAddress = userCredentials?.email_address;
    this.language = this.localStorageService.getItem('language');
  }

  /**************************************************************************
   * @description get user info
   *************************************************************************/
   getUserInfo() {
    this.getDataFromLocalStorage();
    return new Promise<any>(resolve =>
       this.httpClient.get<IUserInfo>(`${environment.userGatewayApiUrl}` +
        `/getprofileinfos?application_id=${this.applicationId}&email_address=${this.emailAddress}`)
        .subscribe( (data) => {
          this.userInfo = data;
          console.log('this.userInfo', this.userInfo);
          this.userType = this.userInfo['user'][0].user_type;
          this.connectedUser$.next(data);
          this.getImage(data['user'][0].photo);
          resolve(this.userInfo);
        }));
  }
  /**************************************************************************
   * @description Redirect User to specific route and set SideNav items
   * @param userRole Role of connected User
   *************************************************************************/
  redirectUser(userRole: string, currentState: string): void {
    switch (userRole) {
      case 'COMPANY':
      case 'STAFF':
      { this.getUrl('manager', currentState );
      }
        break;
      case 'COLLABORATOR': {
        this.getUrl('collaborator', currentState );
      }
        break;
      case 'CANDIDATE': {
        this.getUrl('candidate', currentState );
      }
        break;
    }
  }

  /**************************************************************************
   * @description : Get url
   * @param: startUrl: start url
   * @param: currentState: current state
   *************************************************************************/
  getUrl(startUrl: string, currentState: string) {
    this.moduleName$.next(startUrl);
    if (currentState.startsWith(`/${startUrl}`)) {
      this.router.navigate([currentState]);
    } else {
      this.router.navigate([`/${startUrl}`]);
    }
  }

  /**
   * @description : GET IMAGE FROM BACK AS BLOB
   *  create Object from blob and convert to url
   */
  getImage(idFile) {
    this.httpClient.get(`${environment.uploadFileApiUrl}/image/` + idFile, {
      responseType: 'blob',
    })
      .subscribe(
        data => {
          const unsafeImageUrl = URL.createObjectURL(data);
          this.avatar$.next(this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl));
        }, error => {
          console.log(error);
        });
  }

  /**************************************************************************
   * @description Emit color
   * @param color
   *************************************************************************/
  emitColor(color: string): void {
    this.colorSubject$.next(color);
  }

  /**************************************************************************
   * @description Emit class color
   * @param classColor class color
   *************************************************************************/
  emitClass(classColor: object): void {
    this.classSubject$.next(classColor);
  }

  /**************************************************************************
   * @description Emit message if image exist
   * @param message: string
   *************************************************************************/
  haveImage(message: string): void {
    this.haveImage$.next(message);
  }

  /**************************************************************************
   * @description get user role
   * @param applicationId: string
   * @param email: string
   *************************************************************************/
  getUserRole(applicationId: string, email: string) {
    return this.httpClient.get(`${environment.userRoleApiUrl}` + `?application_id=${applicationId}&email_address=${email}`);
  }
  /**************************************************************************
   * @description get company role features
   * @param role: string
   * @param email: string
   *************************************************************************/
  getCompanyRoleFeatures(role: string, email: string) {
    return this.httpClient.get(`${environment.companyRoleFeaturesApiUrl}?role_code=${role}&email_address=${email}`);
  }

    /**************************************************************************
   * @description get role features
   * @param data: IUserInfo
   * @param roleCode: string
   *************************************************************************/
     getRoleFeature(data: IUserInfo, roleCode: string): void {
      this.getCompanyRoleFeatures(roleCode, this.userInfo['company'][0]['companyKey']['email_address'])
        .subscribe((list) => {
          this.companyRolesFeatures.push(( list as []).map(element => element['companyRoleFeaturesKey']['feature_code']));
          if (this.companyRolesFeatures.length > 1) {
            this.companyRolesFeatures.splice(0, this.companyRolesFeatures.length - 1);
          }
          this.licenceFeature =  data['licencefeatures'].map(element => element['LicenceFeaturesKey']['feature_code']);
           this.isLoadingSubject.next(true);
        });
    }
  /**************************************************************************
   * @description get list of user by company email
   * @param company_email: email of the manager company
   * @param user_type: type of the user

   *************************************************************************/
  getUsers(company_email: string, user_type: string) {
    return this.httpClient.get(`${environment.userApiUrl}?company_email=${company_email}&user_type=${user_type}`);
  }
  getAllUsers(filter: string) {
    return this.httpClient.get(`${environment.userApiUrl}/${filter}`);
  }
  updateUser(User: IUserModel): Observable<any> {
    return this.httpClient.put<IUserModel>(`${environment.userApiUrl}`, User);
  }}
