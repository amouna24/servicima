import { Component, OnInit } from '@angular/core';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

import { IResumeModel } from '@shared/models/resume.model';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';
import { IResumeProjectDoneModel } from '@shared/models/projectDone.model';
import { IResumeProjectDetailsDoneModel } from '@shared/models/projectDetailsDone.model';
import { IResumeProfessionalExperienceDoneModel } from '@shared/models/professionalExperienceDone.model';
import { UploadService } from '@core/services/upload/upload.service';

import { ResumeThemeComponent } from '@shared/modules/resume-management/modules/resume-theme/resume-theme.component';

import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'wid-resume-done',
  templateUrl: './resume-done.component.html',
  styleUrls: ['./resume-done.component.scss']
})
export class ResumeDoneComponent implements OnInit {
  count = 0;
  resume_code: string;
  generalInfoList: IResumeModel[] = [];
  proExpList: IResumeProfessionalExperienceDoneModel[] = [];
  techSkillList: IResumeTechnicalSkillsModel[] = [];
  funcSkillList: IResumeFunctionalSkillsModel[] = [];
  interventionList: IResumeInterventionModel[] = [];
  languageList: IResumeLanguageModel[] = [];
  sectionList: IResumeSectionModel[] = [];
  certifList: IResumeCertificationDiplomaModel[] = [];
  projectList: IResumeProjectDoneModel[] = [];
  projectDetailsList: IResumeProjectDetailsDoneModel[] = [];
  projectDetailsSectionList: IResumeProjectDetailsSectionModel[] = [];
  theme: string;
  years = 0;
  company_name: string;
  company_email: string;
  company_logo: string;
  phone: string;
  dateNow = new Date().getFullYear().toString();
  contact_email: string;
  imageUrl =  `${environment.uploadFileApiUrl}/image/`;
  loading: boolean;
  constructor(
    private resumeService: ResumeService,
    private userService: UserService,
    private datepipe: DatePipe,
    private uploadService: UploadService,
    private dialog: MatDialog
  ) {
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
   await this.yearsOfExpAuto();
   this.getResumeInfo();
  }
  yearsOfExpAuto() {
     this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.resume_code = response[0].ResumeKey.resume_code.toString();
            this.resumeService.getProExp(
              `?resume_code=${this.resume_code}`)
              .subscribe(
                (responseProExp) => {
                  if (responseProExp['msg_code'] !== '0004') {
                    responseProExp.forEach((proExp) => {
                      const difference = new Date(proExp.ResumeProfessionalExperienceKey.end_date).getFullYear() -
                        new Date(proExp.ResumeProfessionalExperienceKey.start_date).getFullYear();
                      this.years = difference + this.years;
                    });

  }});
          }});
  }
  /**************************************************************************
   * @description Count the percentage of the resume
   *************************************************************************/
  countResume() {
    if (this.generalInfoList.length > 0) {
      this.count += 13;
    }
      this.count += 22;
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
  /**************************************************************************
   * @description Get Resume Data from Resume Service
   *************************************************************************/
  getResumeInfo() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.company_name = userInfo['company'][0]['company_name'];
            this.company_logo = userInfo['company'][0]['photo'];
            this.company_email = userInfo['company'][0]['companyKey']['email_address'];
            this.phone = userInfo['company'][0]['phone_nbr1'];
            this.contact_email = userInfo['company'][0]['contact_email'];
          }
        });
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
            this.resumeService.getTechnicalSkills(
              `?resume_code=${this.resume_code}`
            ),
            this.resumeService.getLanguage(
              `?resume_code=${this.resume_code}`
            ),
            this.resumeService.getIntervention(
              `?resume_code=${this.resume_code}`
            ), this.resumeService.getFunctionalSkills(
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
              if (data[0].length > 0) {
                if (data[0][0]['years_of_experience'] === null) {
                  data[0][0]['years_of_experience'] = this.years;
                }
                // @ts-ignore
              this.generalInfoList = data[0];
              }
              if (data[1].length > 0) {
                // @ts-ignore
              this.techSkillList = data[1]; }
              if (data[2].length > 0) {
                // @ts-ignore
              this.languageList = data[2]; }
              if (data[3].length > 0) {
                // @ts-ignore
              this.interventionList = data[3]; }
              if (data[4].length > 0) {
                // @ts-ignore
              this.funcSkillList = data[4]; }
              if (data[5].length > 0) {
                // @ts-ignore
                this.sectionList = data[5]; }
              if (data[6].length > 0) {
                // @ts-ignore
              this.certifList = data[6]; }
              this.countResume();
              this.getProExp();
            });
        });
  }
  getProjectDetails(oneProject) {
    this.resumeService.getProjectDetails(`?project_code=${oneProject.ResumeProjectKey.project_code}`)
        .subscribe((projectDetails) => {
          projectDetails.forEach((oneProjDet) => {
            new Promise((resolveProject) => {
              resolveProject(this.resumeService.getProjectDetailsSection(
                `?project_details_code=${oneProjDet.ResumeProjectDetailsKey.project_details_code}`)
                .subscribe((proDetSection) => {
                  this.projectDetailsSectionList = proDetSection;
                }));
            }).then((res) => {
              const oneProDet: IResumeProjectDetailsDoneModel = {
                _id: oneProjDet._id,
                ResumeProjectDetailsKey: oneProjDet.ResumeProjectDetailsKey,
                project_detail_title: oneProjDet.project_detail_title,
                project_detail_desc: oneProjDet.project_detail_desc,
                project_details_code: oneProjDet.project_details_code,
                project_code: oneProjDet.project_code,
                projectDetailsSection: this.projectDetailsSectionList,

              };
              this.projectDetailsList.push(oneProDet);
            });
          });
    });
    this.projectDetailsSectionList = [];
    return(this.projectDetailsList);
  }
  getProject(oneProExp) {
    console.log('project=', oneProExp);
        this.resumeService.getProject(`?professional_experience_code=${oneProExp.ResumeProfessionalExperienceKey.professional_experience_code}`)
          .subscribe( (project) => {
            project.forEach( (oneProject) => {
              const proj = {
                  _id: oneProject._id,
                  ResumeProjectKey: oneProject.ResumeProjectKey,
                  start_date: oneProject.start_date,
                  end_date: oneProject.end_date,
                  project_title: oneProject.project_title,
                  project_code: oneProject.project_code,
                  professional_experience_code: oneProject.professional_experience_code,
                  projectDetails: this.getProjectDetails(oneProject),
              };
              console.log('one project=', proj);
              this.projectList.push(proj);
            });
            });
        this.projectDetailsList = [];
        return (this.projectList);
  }
  getProExp() {
    this.resumeService.getProExp(`?resume_code=${this.resume_code}`)
      .subscribe( async (proExp) => {
        for (const oneProject of proExp) {
          const proExpD = {
            _id: oneProject._id,
            ResumeProfessionalExperienceKey: oneProject.ResumeProfessionalExperienceKey,
            position: oneProject.position,
            customer: oneProject.customer,
            professional_experience_code: oneProject.professional_experience_code,
            resume_code: oneProject.ResumeProfessionalExperienceKey.resume_code,
            start_date: oneProject.ResumeProfessionalExperienceKey.start_date,
            end_date: oneProject.ResumeProfessionalExperienceKey.end_date,
            projects: await this.getProject(oneProject),
          };
          this.proExpList.push(proExpD);
        }
      });
    return (this.proExpList);
  }
  /**************************************************************************
   * @description Upload Image to Server  with async to promise
   *************************************************************************/
  async uploadFile(res) {
    return await this.uploadService.getImage(res);
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
/*  getProjectDetailsSectionInfo() {
    if (this .projectDetailsList.length > 0) { ; } {
      this.projectDetailsList.forEach(
        (projectDetailsData) => {
          this.resumeService.getProjectDetailsSection(
            `?project_details_code=${projectDetailsData.ResumeProjectDetailsKey.project_details_code}`
          ).subscribe(
            (responseProjectDetailsSection) => {
              if (responseProjectDetailsSection.length > 0) {
              responseProjectDetailsSection.forEach(
                (responseProjectDetailsSectionData) => {
                  this.projectDetailsSectionList.push(responseProjectDetailsSectionData);
                }
              ); }
            });
        }
      );
    }
  }*/
  /**************************************************************************
   * @description Get Cv Document in Docx format and the user chose if he want to save it in dataBase or just check it
   *************************************************************************/
  async getDocument(action: string, theme: string) {
    this.loading = true;
    if ( this.certifList.length > 0) {
    this.certifList.forEach((cert) => {
      cert.start_date = this.datepipe.transform(cert.start_date, 'yyyy-MM-dd');
      cert.end_date = this.datepipe.transform(cert.end_date, 'yyyy-MM-dd');
    }); }
    if ( this.proExpList.length > 0) {
      this.proExpList.forEach((pro) => {
      pro.ResumeProfessionalExperienceKey.start_date = this.datepipe.transform(pro.ResumeProfessionalExperienceKey.start_date, 'yyyy-MM-dd');
      pro.ResumeProfessionalExperienceKey.end_date = this.datepipe.transform(pro.ResumeProfessionalExperienceKey.end_date, 'yyyy-MM-dd');
    }); }
    if ( this.projectList.length > 0) {
    this.projectList.forEach((proj) => {
      proj.start_date = this.datepipe.transform(proj.start_date, 'yyyy-MM-dd');
      proj.end_date = this.datepipe.transform(proj.end_date, 'yyyy-MM-dd');
    }); }
    const data = {
      person: {
        name: this.generalInfoList[0].init_name,
        role: this.generalInfoList[0].actual_job,
        experience: this.generalInfoList[0].years_of_experience || 0,
        phoneNum: this.phone.toString(),
        currentYear: this.dateNow,
        imageUrl: this.imageUrl + this.generalInfoList[0].image,
        diplomas: this.certifList,
        company_name: this.company_name,
        company_email: this.company_email,
        company_logo: this.imageUrl +  this.company_logo,
        contact_email: this.contact_email,
        technicalSkills: this.techSkillList,
        functionnalSkills: this.funcSkillList,
        intervention: this.interventionList,
        pro_exp:  this.proExpList,
        project: this.projectList,
        project_details: this.projectDetailsList,
        project_details_section: this.projectDetailsSectionList,
        language: this.languageList,
        section: this.sectionList,
      }
    };
    await this.downloadDocs(data, action, theme);
  }
  openThemeDialog(action): void {
    const dialogRef = this.dialog.open(ResumeThemeComponent, {
      width: '800px',
      height: '200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      this.getDocument(action, result); }
    });
  }
  downloadDocs(data, action, theme) {
       this.resumeService.getResumePdf(data, theme, action).subscribe(
           async res => {
             if (action === 'preview') {
              const fileURL = URL.createObjectURL(res);
               const openPdf = window.open(fileURL, '_blank');
              this.loading = false;
             } else if (action === 'generate') {
               saveAs(res, `${this.generalInfoList[0].init_name}.docx`);
               const resumeName = await this.uploadFile(res);
             }
           },
           (error) => {
             console.log(error);
           }
         );
  }
  getPro() {
    console.log('professional exp = ', this.proExpList);
  }
}
