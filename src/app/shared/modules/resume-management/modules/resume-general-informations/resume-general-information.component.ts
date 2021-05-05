import { Component, OnInit } from '@angular/core';
import { IUserModel } from '@shared/models/user.model';
import { IChildItem } from '@shared/models/side-nav-menu/child-item.model';
import { userType } from '@shared/models/userProfileType.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { ITheme } from '@shared/models/theme.model';
import { AuthService } from '@widigital-group/auth-npm-front';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { UserService } from '@core/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { sidenavRightMenu } from '@shared/statics/right-sidenav-menu.static';
import { takeUntil } from 'rxjs/operators';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeModel } from '@shared/models/resume.model';
import { IViewParam } from '@shared/models/view.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { indicate } from '@core/services/utils/progress';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'wid-resume-general-information',
  templateUrl: './resume-general-information.component.html',
  styleUrls: ['./resume-general-information.component.scss']
})
export class ResumeGeneralInformationComponent implements OnInit {

  CreationForm: FormGroup;
  user: IUserModel;
  avatar: any;
  haveImage: any;
  profileUserType = userType.UT_RESUME;
  generalInfo: IResumeModel;
  firstname: string = this.userService.connectedUser$.getValue().user[0]['first_name'];
  lastname: string = this.userService.connectedUser$.getValue().user[0]['last_name'];
  company: string = this.userService.connectedUser$.getValue().user[0]['company_email'];
  langList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  email: string;
  showYears = false;
  update = false;
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
  ) {
  }

  async ngOnInit() {
    this.initForm();
    this.langList.next(this.appInitializerService.languageList.map(
      (obj) => {
        return { value: obj.LanguageKey.language_code, viewValue: obj.language_desc};
      }
    ));
    await this.getResume();
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

  showHideYears() {
    this.showYears = !this.showYears;
  }

  /**
   *  @description Resume
   */
  async getResume() {
    await this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (generalInfo) => {
          if (generalInfo['msg_code'] !== '0004') {
            if (!!generalInfo) {
            this.updateForm(generalInfo);
          }
          console.log('generalInfo', generalInfo);
          this.update = true;
        }}
      );
  }

  updateForm(generalInformation) {
    this.CreationForm.patchValue({
      init_name: generalInformation[0].init_name,
      actual_job: generalInformation[0].actual_job,
      years_of_experience: generalInformation[0].years_of_experience,
      language_id: generalInformation[0].ResumeKey.language_id,
      resume_code: generalInformation[0].ResumeKey.resume_code
    });
    this.showHideYears();
  }

  /**
   * @description Create Form
   */
  initForm() {
    this.CreationForm = this.fb.group({
      application_id: this.localStorageService.getItem('userCredentials').application_id,
      email_address: this.localStorageService.getItem('userCredentials').email_address,
      company_email: this.company,
      resume_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES`,
      language_id: '',
      years_of_experience: null,
      actual_job: '',
      image: this.avatar,
      init_name: '',
      status: 'A'
    });
  }

  /**
   * @description Create Resume
   */
  createUpdateResume() {
    if (this.update === false) {
    this.generalInfo = this.CreationForm.value;
    this.generalInfo.image = this.avatar.toString();
    if (this.CreationForm.valid) {
      console.log(this.CreationForm.value);
      this.resumeService.addResume(this.generalInfo).subscribe(data => {
        console.log('form created', data);
        this.router.navigate(['/candidate/resume/professionalExperience']);
      });
      } else {
      console.log('Form is not valid');
    } } else {
      this.generalInfo = this.CreationForm.value;
      console.log('general info update =', this.generalInfo);
      this.resumeService.updateResume(this.generalInfo).subscribe(data => {
        this.router.navigate(['/candidate/resume/professionalExperience']);
      console.log('form created', data); });
    }
  }

  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType);
  }
  testRequired() {
    return (this.CreationForm.controls.init_name.value === '') || (this.CreationForm.controls.language_id.value === '')
      || (this.CreationForm.controls.actual_job.value === '') ;
  }
}
