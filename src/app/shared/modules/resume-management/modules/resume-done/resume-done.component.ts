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

@Component({
  selector: 'wid-resume-done',
  templateUrl: './resume-done.component.html',
  styleUrls: ['./resume-done.component.scss']
})
export class ResumeDoneComponent implements OnInit {
count: number;
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

  ngOnInit(): void {
  }

  getResumeInfo() {
      this.resumeService.getResume(
        // tslint:disable-next-line:max-line-length
        `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
        .subscribe(
          (response) => {
            this.resume_code = response[0].ResumeKey.resume_code.toString();
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
/*                  this.resumeService.getCustomSection(
              `?resume_code=${this.resume_code}`
            ),
                  this.resumeService.getCertifDiploma(
              `?resume_code=${this.resume_code}`
            ),*/
                ]).toPromise().then(
                  (data) => {
                   this.generalInfoList = data[0];
                   this.proExpList = data[1];
                    this.techSkillList = data[2];
                    this.languageList = data[3];
                    this.interventionList = data[4];
                    this.funcSkillList = data[5];
/*                    this.sectionList = data[6];
                    this.certifList = data[7];*/
                  }); });
  }

}
