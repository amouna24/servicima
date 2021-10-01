import { Component, OnInit } from '@angular/core';
import { IUserModel } from '@shared/models/user.model';
import { userType } from '@shared/models/userProfileType.model';
import { BehaviorSubject, Subject } from 'rxjs';

import { AuthService } from '@widigital-group/auth-npm-front';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { UserService } from '@core/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeModel } from '@shared/models/resume.model';
import { IViewParam } from '@shared/models/view.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { dataAppearance } from '@shared/animations/animations';

@Component({
  selector: 'wid-resume-general-information',
  templateUrl: './resume-general-information.component.html',
  styleUrls: ['./resume-general-information.component.scss'],
  animations: [
    dataAppearance,
  ]
})
export class ResumeGeneralInformationComponent implements OnInit {
  CreationForm: FormGroup;
  user: IUserModel;
  avatar: any;
  haveImage: any;
  profileUserType = userType.UT_RESUME;
  generalInfo: IResumeModel;
  firstname: string;
  lastname: string;
  company: string;
  langList: BehaviorSubject<IViewParam[]>;
  companyName: string;
  isChecked = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  email: string;
  showYears: boolean;
  update = false;
  photo: FormData;
  resumeCode: string;
  companyUserType: string;
  years = 0;
  showNumberError = false;
  generalInfoManager: IResumeModel;
  firstNameManager: string;
  lastNameManager: string;
  isLoadingImage = true;
  /**********************************************************************
   * @description Resume general information constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private localStorageService: LocalStorageService,
    private appInitializerService: AppInitializerService,
    private uploadService: UploadService,
  ) {
    this.getDataFromPreviousRoute();
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    this.showYears = false;
    this.firstname = this.firstNameManager ? this.firstNameManager : this.userService.connectedUser$.getValue().user[0]['first_name'];
    this.lastname = this.lastNameManager ? this.lastNameManager : this.userService.connectedUser$.getValue().user[0]['last_name'];
    this.company = this.userService.connectedUser$.getValue().user[0]['company_email'];
    this.getCompanyName();
    this.initForm();
    this.getLanguageList();
    await this.getResume();
  }
  /**************************************************************************
   * @description : Show or Hide The input of Years of experience
   *************************************************************************/
  showHideYears() {
    this.showYears = !this.showYears;
  }
  /**************************************************************************
   *  @description Get Resume Data from Resume Service and reusme Image from upload Service
   *************************************************************************/
  async getResume() {
    if (this.generalInfoManager) {
      if ((this.generalInfoManager.image !== undefined) && (this.generalInfoManager.image !== null)) {
        this.haveImage = this.generalInfoManager.image;
        this.avatar = await this.uploadService.getImage(this.generalInfoManager.image);
      } else {
        this.userService.avatar$.subscribe(
          avatar => {
            this.avatar = avatar;
          }
        );
      }
      await this.updateForm(this.generalInfoManager);
      this.update = true;
    } else if (this.resumeCode) {
      await this.resumeService.getResume(
        `?resume_code=${this.resumeCode}`)
        .subscribe(
          async (generalInfo) => {
            if (generalInfo['msg_code'] !== '0004') {
              if (!!generalInfo) {
                if ((generalInfo[0].image !== undefined) && (generalInfo[0].image !== null)) {
                  this.haveImage = generalInfo[0].image;
                  this.avatar = await this.uploadService.getImage(generalInfo[0].image);
                } else {
                  this.userService.connectedUser$.subscribe((data) => {
                    if (!!data) {
                      this.user = data['user'][0];
                      this.haveImage = data['user'][0]['photo'];
                      if (!this.haveImage) {
                        this.userService.haveImage$.subscribe((res) => {
                            this.haveImage = res;
                          }
                        );
                      }
                    }
                  });
                  this.userService.avatar$.subscribe(
                    avatar => {
                      this.avatar = avatar;
                    }
                  );
                }
                this.updateForm(generalInfo[0]);
                this.generalInfoManager = generalInfo[0];
                this.update = true;
              }
            } else {
              this.userService.connectedUser$.subscribe((data) => {
                if (!!data) {
                  this.user = data['user'][0];
                  this.haveImage = data['user'][0]['photo'];
                  if (!this.haveImage) {
                    this.userService.haveImage$.subscribe((res) => {
                        this.haveImage = res;
                      }
                    );
                  }
                }
              });
              this.userService.avatar$.subscribe(
                avatar => {
                  this.avatar = avatar;
                }
              );
            }
          }
        );
    } if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY' && !this.generalInfoManager && !this.resumeCode) {
       await this.router.navigate(['manager/resume/']);
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE' ||
      this.userService.connectedUser$.getValue().user[0].user_type === 'COLLABORATOR') {
      await this.resumeService.getResume(
          `?email_address=${this.userService.connectedUser$
            .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
            .getValue().user[0]['company_email']}`)
          .subscribe(
            async (generalInfo) => {
              if (generalInfo['msg_code'] !== '0004') {
                if (!!generalInfo) {
                  if ((generalInfo[0].image !== undefined) && (generalInfo[0].image !== null)) {
                    this.haveImage = generalInfo[0].image;
                    this.avatar = await this.uploadService.getImage(generalInfo[0].image);
                  } else {
                    this.userService.connectedUser$.subscribe((data) => {
                      if (!!data) {
                        this.user = data['user'][0];
                        this.haveImage = data['user'][0]['photo'];
                        if (!this.haveImage) {
                          this.userService.haveImage$.subscribe((res) => {
                              this.haveImage = res;
                            }
                          );
                        }
                      }
                    });
                    this.userService.avatar$.subscribe(
                      avatar => {
                        this.avatar = avatar;
                      }
                    );
                  }
                  this.updateForm(generalInfo[0]);
                  this.update = true;
                }
              } else {
                this.userService.connectedUser$.subscribe((data) => {
                  if (!!data) {
                    this.user = data['user'][0];
                    this.haveImage = data['user'][0]['photo'];
                    if (!this.haveImage) {
                      this.userService.haveImage$.subscribe((res) => {
                          this.haveImage = res;
                        }
                      );
                    }
                  }
                });
                this.userService.avatar$.subscribe(
                  avatar => {
                    this.avatar = avatar;
                  }
                );
              }
            }
          );
      }
    this.isLoadingImage = false;
  }
  /**************************************************************************
   * @description set Existing data in the Resume Form
   * @param generalInformation: General information model
   *************************************************************************/
  async updateForm(generalInformation: IResumeModel) {
    this.CreationForm.patchValue({
      init_name: generalInformation.init_name,
      actual_job: generalInformation.actual_job,
      years_of_experience: generalInformation.years_of_experience,
      language_id: generalInformation.ResumeKey.language_id,
      resume_code: generalInformation.ResumeKey.resume_code,
      image: generalInformation.image,
      resume_filename_docx: generalInformation.resume_filename_docx,
      resume_filename_pdf: generalInformation.resume_filename_pdf,
    });
    if (this.CreationForm.controls.years_of_experience.value !== null) {
      this.showHideYears();
    } else {
              this.resumeService.getProExp(
                `?resume_code=${generalInformation.ResumeKey.resume_code}`)
                .subscribe(
                  (responseProExp) => {
                    if (responseProExp['msg_code'] !== '0004') {
                      responseProExp.forEach((proExp) => {
                        const difference = new Date(proExp.ResumeProfessionalExperienceKey.end_date).getFullYear() -
                          new Date(proExp.ResumeProfessionalExperienceKey.start_date).getFullYear();
                        this.years = difference + this.years;
                      });
                      this.CreationForm.patchValue({
                        years_of_experience: this.years,
                      });
                      this.showHideYears();
                    }
                  });
            }
    }
  /********************************************************
   * @description Initialization of Resume Form
   ********************************************************/
  initForm() {
    this.CreationForm = this.fb.group({
      application_id: this.generalInfoManager ? this.generalInfoManager.application_id :
        this.localStorageService.getItem('userCredentials').application_id,
      email_address: this.generalInfoManager ? this.generalInfoManager.email_address :
        this.localStorageService.getItem('userCredentials').email_address,
      company_email: this.company,
      resume_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES`,
      language_id: ['', Validators['required']],
      years_of_experience: [null],
      actual_job: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      image: this.avatar,
      init_name: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      status: 'A',
      resume_filename_docx: null,
      resume_filename_pdf: null,
    });
  }
  /****************************************************
   * @description Create Or Update Resume General information
   ***************************************************/
  async createUpdateResume() {
    let filename = null;
    if (this.photo) {
      filename = await this.uploadService.uploadImage(this.photo)
        .pipe(
          map(
            response => response.file.filename
          ))
        .toPromise();
    }
    if (this.update === false) {
      this.generalInfo = this.CreationForm.value;
      this.generalInfo.image = filename;
      if (this.CreationForm.valid && !this.showNumberError) {
        this.resumeService.addResume(this.generalInfo).subscribe(data => {

          if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
            this.router.navigate(['/manager/resume/diploma'], {
              state: {
                resumeCode: this.generalInfoManager ? this.generalInfoManager.resume_code : this.resumeCode,
                companyUserType: this.companyUserType,
              }
            });          } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE') {
            this.router.navigate(['/candidate/resume/certifDiploma'], {
              state: {
                resumeCode: this.generalInfoManager ? this.generalInfoManager.resume_code : this.resumeCode
              }
            });
          } else {
            this.router.navigate(['/collaborator/resume/certifDiploma'], {
              state: {
                resumeCode: this.generalInfoManager ? this.generalInfoManager.resume_code : this.resumeCode
              }
            });
          }
        });
      } else {
      }
    } else {
      this.generalInfo = this.CreationForm.value;
      if (filename === null) {
        filename = this.CreationForm.controls.image.value;
      }
      this.generalInfo.image = filename;
      if (this.CreationForm.valid && !this.showNumberError) {
        if (this.generalInfoManager) {
          this.generalInfo.email_address = this.generalInfoManager.ResumeKey.email_address;
        }
        this.resumeService.updateResume(this.generalInfo).subscribe(data => {
          if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
            this.router.navigate(['/manager/resume/diploma'], {
              state: {
                resumeCode: this.generalInfoManager ? this.generalInfoManager.resume_code : this.resumeCode,
                companyUserType: this.companyUserType,

              }
            });          } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE') {
            this.router.navigate(['/candidate/resume/certifDiploma'], {
              state: {
                resumeCode: this.generalInfoManager ? this.generalInfoManager.resume_code : this.resumeCode
              }
            });
          } else {
            this.router.navigate(['/collaborator/resume/certifDiploma'], {
              state: {
                resumeCode: this.generalInfoManager ? this.generalInfoManager.resume_code : this.resumeCode
              }
            });
          }
        });
      }
    }
    this.showNumberError = false;
  }
  /**************************************************************************
   * @description Get company name from user Service
   *************************************************************************/
  getCompanyName() {
      this.userService.connectedUser$
        .subscribe(
          (userInfo) => {
            if (userInfo) {
              this.companyName = userInfo['company'][0]['company_name'];
            }
          });
  }
  /**************************************************************************
   * @description Get Language list from RefData and RefType
   *************************************************************************/
  getLanguageList() {
    this.langList = new BehaviorSubject<IViewParam[]>([]);
    this.langList.next(this.appInitializerService.languageList.map(
      (obj) => {
        return { value: obj.LanguageKey.language_code, viewValue: obj.language_desc};
      }
    ));
  }
  /**************************************************************************
   * @description Get imported image by the user
   * @param obj: object uploaded
   *************************************************************************/
  getFile(obj: FormData) {
    this.photo = obj;
  }
  /**************************************************************************
   * @description Show indexation
   *************************************************************************/
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
  /**************************************************************************
   * @description get resume general informations data of a user
   *************************************************************************/
  getDataFromPreviousRoute() {
    this.generalInfoManager = this.router.getCurrentNavigation()?.extras?.state?.generalInformation;
    this.resumeCode = this.router.getCurrentNavigation()?.extras?.state?.resumeCode;
    this.firstNameManager = this.router.getCurrentNavigation()?.extras?.state?.firstName;
    this.lastNameManager = this.router.getCurrentNavigation()?.extras?.state?.lastName;
    console.log('user_type', this.router.getCurrentNavigation()?.extras?.state?.user_type);
    this.companyUserType = this.router.getCurrentNavigation()?.extras?.state?.user_type;
  }
}
