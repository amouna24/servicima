import { Component, OnInit } from '@angular/core';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { forkJoin, ObservedValuesFromArray } from 'rxjs';
import { IResumeModel } from '@shared/models/resume.model';
import { IResumeProfessionalExperienceKeyModel } from '@shared/models/resumeProfessionalExperienceKey.model';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { ILanguageModel } from '@shared/models/language.model';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'wid-resume-done',
  templateUrl: './resume-done.component.html',
  styleUrls: ['./resume-done.component.scss']
})
export class ResumeDoneComponent implements OnInit {
count = 0;
resume_code: string;
generalInfoList: IResumeModel[] = [];
proExpList: IResumeProfessionalExperienceKeyModel[] = [];
techSkillList: IResumeTechnicalSkillsModel[] = [];
funcSkillList: IResumeFunctionalSkillsModel[] = [];
interventionList: IResumeInterventionModel[] = [];
languageList: IResumeLanguageModel[] = [];
sectionList: IResumeSectionModel[] = [];
certifList: IResumeCertificationDiplomaModel[] = [];
  constructor(
    private resumeService: ResumeService,
    private userService: UserService,
    ) { }

 async ngOnInit() {
  await  this.getResumeInfo();

  }
  countResume() {
    console.log(this.generalInfoList.length);
    if (this.generalInfoList.length > 0) {
      this.count += 13;
    }
    if (this.proExpList.length > 0) {
      this.count += 22;
    }
    if (this.techSkillList.length > 0) {
      this.count += 13;
    }
    if (this.funcSkillList.length > 0) {
      this.count += 13;
    }
    if (this.interventionList.length > 0) {
      this.count += 13;
    }
    if (this.certifList.length > 0) {
      this.count += 13;
    }
    if (this.languageList.length > 0) {
      this.count += 13;
    }
    return this.count;
  }

  getResumeInfo() {
      this.resumeService.getResume(
        // tslint:disable-next-line:max-line-length
        `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
        .subscribe(
          (response) => {
            this.resume_code = response[0].ResumeKey.resume_code.toString();
            console.log('resume_code=', this.resume_code);
                 forkJoin([
                     this.resumeService.getResume(
                    `?resume_code=${this.resume_code}`
            ),
                  this.resumeService.getProExp(
                       `?resume_code=${this.resume_code}`
            ),
                     this.resumeService.getTechnicalSkills(
              `?resume_code=${this.resume_code}`
            ),
                     this.resumeService.getLanguage(
              `?resume_code=${this.resume_code}`
            ),
                     this.resumeService.getIntervention(
              `?resume_code=${this.resume_code}`
            ),
                 this.resumeService.getFunctionalSkills(
              `?resume_code=${this.resume_code}`
            ),
                  this.resumeService.getCustomSection(
              `?resume_code=${this.resume_code}`
            ),
                  this.resumeService.getCertifDiploma(
              `?resume_code=${this.resume_code}`
            ),
                ]).toPromise().then(
                  (data) => {
                    // @ts-ignore
                   this.generalInfoList = data[0];
                    // @ts-ignore
                   this.proExpList = data[1];
                    // @ts-ignore
                    this.techSkillList = data[2];
                    // @ts-ignore
                    this.languageList = data[3];
                    // @ts-ignore
                    this.interventionList = data[4];
                    // @ts-ignore
                  this.funcSkillList = data[5];
                    // @ts-ignore
                    this.sectionList = data[6];
                    // @ts-ignore
                    this.certifList = data[7];
                    this.countResume();
                  });
          });
  }
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }

}
