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
import { showProExp } from '@shared/animations/animations';

@Component({
  selector: 'wid-resume-general-information',
  templateUrl: './resume-general-information.component.html',
  styleUrls: ['./resume-general-information.component.scss'],
  animations: [
    showProExp,
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
  years = 0;
  showNumberError = false;

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
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    this.showYears = false;
    this.firstname = this.userService.connectedUser$.getValue().user[0]['first_name'];
    this.lastname = this.userService.connectedUser$.getValue().user[0]['last_name'];
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
              this.updateForm(generalInfo);
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

  /**************************************************************************
   * @description set Existing data in the Resume Form
   * @param generalInformation: General information model
   *************************************************************************/
  async updateForm(generalInformation: IResumeModel[]) {
    this.CreationForm.patchValue({
      init_name: generalInformation[0].init_name,
      actual_job: generalInformation[0].actual_job,
      years_of_experience: generalInformation[0].years_of_experience,
      language_id: generalInformation[0].ResumeKey.language_id,
      resume_code: generalInformation[0].ResumeKey.resume_code,
      image: generalInformation[0].image,
    });
    console.log('this.CreationForm.controls.years_of_experience.value', this.CreationForm.controls.years_of_experience.value);
    if (this.CreationForm.controls.years_of_experience.value !== null) {
      this.showHideYears();
    } else {
      await this.resumeService.getResume(
        `?email_address=${this.userService.connectedUser$
          .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
          .getValue().user[0]['company_email']}`)
        .subscribe(
          (response) => {
            if (response['msg_code'] !== '0004') {
              this.resumeCode = response[0].ResumeKey.resume_code.toString();
              this.resumeService.getProExp(
                `?resume_code=${this.resumeCode}`)
                .subscribe(
                  (responseProExp) => {
                    if (responseProExp['msg_code'] !== '0004') {
                      responseProExp.forEach((proExp) => {
                        console.log('proExp', new Date(proExp.ResumeProfessionalExperienceKey.end_date).getFullYear());
                        const difference = new Date(proExp.ResumeProfessionalExperienceKey.end_date).getFullYear() -
                          new Date(proExp.ResumeProfessionalExperienceKey.start_date).getFullYear();
                        console.log('difference=', difference);
                        this.years = difference + this.years;
                      });
                      console.log('years auto = ', this.years);
                      this.CreationForm.patchValue({
                        years_of_experience: this.years,
                      });
                      this.showHideYears();
                    }
                  });
            }
          });
    }
  }

  /********************************************************
   * @description Initialization of Resume Form
   ********************************************************/
  initForm() {
    this.CreationForm = this.fb.group({
      application_id: this.localStorageService.getItem('userCredentials').application_id,
      email_address: this.localStorageService.getItem('userCredentials').email_address,
      company_email: this.company,
      resume_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES`,
      language_id: ['', Validators['required']],
      years_of_experience: [null],
      actual_job: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      image: this.avatar,
      init_name: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      status: 'A'
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
          this.router.navigate(['/candidate/resume/certifDiploma']);
        });
      } else {
      }
    } else {
      this.generalInfo = this.CreationForm.value;
      console.log('filename=', filename);
      if (filename === null) {
        filename = this.CreationForm.controls.image.value;
      }
      this.generalInfo.image = filename;
      if (this.CreationForm.valid && !this.showNumberError) {
        this.resumeService.updateResume(this.generalInfo).subscribe(data => {
          this.router.navigate(['/candidate/resume/certifDiploma']);
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
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
}
