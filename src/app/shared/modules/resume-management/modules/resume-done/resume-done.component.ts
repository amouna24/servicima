import { Component, OnInit } from '@angular/core';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { forkJoin } from 'rxjs';
import { IResumeModel } from '@shared/models/resume.model';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { IResumeProjectDoneModel } from '@shared/models/projectDone.model';
import { IResumeProjectDetailsDoneModel } from '@shared/models/projectDetailsDone.model';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { IResumeProjectDetailsModel } from '@shared/models/resumeProjectDetails.model';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { IResumeProfessionalExperienceDoneModel } from '@shared/models/professionalExperienceDone.model';

import { DatePipe } from '@angular/common';
import { UploadService } from '@core/services/upload/upload.service';
import { TranslateService } from '@ngx-translate/core';

import { ResumeThemeComponent } from '@shared/modules/resume-management/modules/resume-theme/resume-theme.component';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'wid-resume-done',
  templateUrl: './resume-done.component.html',
  styleUrls: ['./resume-done.component.scss']
})
export class ResumeDoneComponent implements OnInit {
  count = 0;
  resumeCode: string;
  generalInfoList: IResumeModel[];
  proExpList: IResumeProfessionalExperienceModel[];
  techSkillList: IResumeTechnicalSkillsModel[];
  funcSkillList: IResumeFunctionalSkillsModel[];
  interventionList: IResumeInterventionModel[];
  languageList: IResumeLanguageModel[];
  sectionList: IResumeSectionModel[];
  certifList: IResumeCertificationDiplomaModel[];
  projectList: IResumeProjectModel[];
  projectDetailsList: IResumeProjectDetailsModel[];
  projectDetailsSectionList: IResumeProjectDetailsSectionModel[];
  theme: string;
  years = 0;
  company_name: string;
  company_email: string;
  companyLogo: string;
  phone: string;
  dateNow: string;
  contact_email: string;
  imageUrl: string;
  loading: boolean;
  translateKey: string[];
  label: object;
  /**********************************************************************
   * @description Resume Preview constructor
   *********************************************************************/
  constructor(
    private resumeService: ResumeService,
    private userService: UserService,
    private datepipe: DatePipe,
    private uploadService: UploadService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    this.dateNow = new Date().getFullYear().toString();
    this.imageUrl =  `${environment.uploadFileApiUrl}/image/`;
    this.initSectionLists();
    this.translateDocs();
   await this.yearsOfExpAuto();
   this.getResumeInfo();
  }
  /**************************************************************************
   * @description Calculate years of experience from professional experience section
   *************************************************************************/
  yearsOfExpAuto() {
     this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
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
                      const difference = new Date(proExp.ResumeProfessionalExperienceKey.end_date).getFullYear() -
                        new Date(proExp.ResumeProfessionalExperienceKey.start_date).getFullYear();
                      this.years = difference + this.years;
                    });

  }});
          }});
  }
  /**************************************************************************
   * @description Count the percentage of the resume
   * @return count returns the percentage reached of the reusme
   *************************************************************************/
  countResume() {
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
  /**************************************************************************
   * @description Get Resume Data from Resume Service
   *************************************************************************/
  getResumeInfo() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.company_name = userInfo['company'][0]['company_name'];
            this.companyLogo = userInfo['company'][0]['photo'];
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
          this.resumeCode = response[0].ResumeKey.resume_code.toString();
          forkJoin([
            this.resumeService.getResume(
              `?resume_code=${this.resumeCode}`
            ),
            this.resumeService.getProExp(
              `?resume_code=${this.resumeCode}`
            ),
            this.resumeService.getTechnicalSkills(
              `?resume_code=${this.resumeCode}`
            ),
            this.resumeService.getLanguage(
              `?resume_code=${this.resumeCode}`
            ),
            this.resumeService.getIntervention(
              `?resume_code=${this.resumeCode}`
            ), this.resumeService.getFunctionalSkills(
              `?resume_code=${this.resumeCode}`
            ),
            this.resumeService.getCustomSection(
              `?resume_code=${this.resumeCode}`
            ),
            this.resumeService.getCertifDiploma(
              `?resume_code=${this.resumeCode}`
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
              this.proExpList = data[1]; }
              if (data[2].length > 0) {
                // @ts-ignore
              this.techSkillList = data[2]; }
              if (data[3].length > 0) {
                // @ts-ignore
              this.languageList = data[3]; }
              if (data[4].length > 0) {
                // @ts-ignore
              this.interventionList = data[4]; }
              if (data[5].length > 0) {
                // @ts-ignore
              this.funcSkillList = data[5]; }
              if (data[6].length > 0) {
                // @ts-ignore
                this.sectionList = data[6]; }
              if (data[7].length > 0) {
                // @ts-ignore
              this.certifList = data[7]; }
              this.countResume();
              this.getProjectInfo();
            });
        });
  }
  /**************************************************************************
   * @description Get Project Data from Resume Service
   *************************************************************************/
   getProjectInfo() {
     let projectFinalList = [];
   const Pro = new Promise((resolve, reject) => {
      if (this.proExpList.length > 0) {
        let a = 0;
        this.proExpList.forEach(
          (proExpData) => {
            this.resumeService.getProject(
              `?professional_experience_code=${proExpData.ResumeProfessionalExperienceKey.professional_experience_code}`
            ).subscribe(
              (responseProject) => {
                if (responseProject['msg_code'] !== '0004') {
                  responseProject.forEach(
                    (responseProjectData) => {
                      this.projectList.push(responseProjectData);
                    }
                  );
                  a = a + 1 ;
                  if (this.proExpList.length === a) {
                    resolve(this.projectList);
                  }
                  projectFinalList = [];
                  projectFinalList = this.projectList;
                }
              });
          }
        );
      }
    }).then( (data) => {
      this.getProjectDetailsInfo();
   });
   }
  /**************************************************************************
   * @description Upload Image to Server  with async to promise
   * @param res It contains the resume in docx format
   * @return res return the image uploaded
   *************************************************************************/
  async uploadFile(res) {
    return await this.uploadService.getImage(res);
  }
  /**************************************************************************
   * @description Get Project Details Data from Resume Service
   *************************************************************************/
  getProjectDetailsInfo() {
    let projectFinalList = [];
    const ProDet = new Promise((resolve, reject) => {
    if (this.projectList.length > 0) {
      let i = 0;
      this.projectList.forEach(
        (projectData) => {
          this.resumeService.getProjectDetails(
            `?project_code=${projectData.ResumeProjectKey.project_code}`
          ).subscribe(
            (responseProjectDetails) => {
              if (responseProjectDetails.length > 0) {
                responseProjectDetails.forEach(
                  (responseProjectDetailsData) => {
                    this.projectDetailsList.push(responseProjectDetailsData);
                  }
                );
                i = i + 1 ;
                if (this.projectList.length === i) {
                  projectFinalList = this.projectDetailsList;
                  resolve(projectFinalList);
                }
                projectFinalList = [];
                projectFinalList = this.projectDetailsList;
            } });
        }
      );
    } }).then( (res: IResumeProjectDetailsModel[]) => {
this.getProjectDetailsSectionInfo(res);
      });
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
   getProjectDetailsSectionInfo(projectDetailsList) {
    if (projectDetailsList.length > 0) {
      for (const projectDetailsData of projectDetailsList) {
        new Promise( (resolve) => {
          this.resumeService.getProjectDetailsSection(
            `?project_details_code=${projectDetailsData.ResumeProjectDetailsKey.project_details_code}`
          ).subscribe(
            (responseProjectDetailsSection) => {
              if (responseProjectDetailsSection.length > 0) {
                resolve(responseProjectDetailsSection);
              }
            });
        }).then( (res: IResumeProjectDetailsSectionModel[]) => {
          res.forEach(
            (responseProjectDetailsSectionData) => {
              this.projectDetailsSectionList.push(responseProjectDetailsSectionData);
            }
          );
        });
      }
    }
  }
  /**************************************************************************
   * @description Get All resume Data
   * @param action  which differs between the generation in pdf or docx format
   * @param theme choose the theme of the resume
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
      if (pro.ResumeProfessionalExperienceKey.end_date === 'Current Date') {
          pro.ResumeProfessionalExperienceKey.end_date = new Date().toString();
        }
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
        label: this.label,
        currentYear: this.dateNow,
        imageUrl: this.imageUrl + this.generalInfoList[0].image,
        diplomas: this.certifList,
        company_name: this.company_name,
        company_email: this.company_email,
        company_logo: this.imageUrl +  this.companyLogo,
        contact_email: this.contact_email,
        technicalSkills: this.techSkillList,
        functionnalSkills: this.funcSkillList,
        intervention: this.interventionList,
        pro_exp: await this.organizeDataProExp(),
        language: this.languageList,
        section: this.sectionList,
      }
    };
    await this.downloadDocs(data, action, theme);
  }
  /**************************************************************************
   * @description open pop up that gives the candidate access to choices his resume Template
   * @param action  which differs between the generation in pdf or docx format

   *************************************************************************/
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
  /**************************************************************************
   * @description generate Resume in docx format or in PDF format
   * @param action which differs between the generation in pdf or docx format
   * @param theme choose the theme of the resume
   * @param data it contains the necessary data for the Resume
   *************************************************************************/
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
  /**************************************************************************
   * @description get organized Professional experience data in JSON object
   * @return proExpData return the professional experience relating to this candidates
   *************************************************************************/
  async organizeDataProExp() {
    const proExpData: IResumeProfessionalExperienceDoneModel[] = [];
    for (const oneProExp of this.proExpList) {
      proExpData.push({
        _id: oneProExp._id,
        ResumeProfessionalExperienceKey: oneProExp.ResumeProfessionalExperienceKey,
        position: oneProExp.position,
        customer: oneProExp.customer,
        professional_experience_code: oneProExp.ResumeProfessionalExperienceKey.professional_experience_code,
        resume_code: oneProExp.ResumeProfessionalExperienceKey.resume_code,
        start_date: oneProExp.ResumeProfessionalExperienceKey.start_date,
        end_date: oneProExp.ResumeProfessionalExperienceKey.end_date,
        projects: await this.getProjectData(oneProExp),
      });
    }
    return (proExpData);
  }
  /**************************************************************************
   * @description get organized Project data in JSON object
   * @param oneProExp it contains the professional experience relating to these projects
   * @return project returns the projects relating to one professional experience
   *************************************************************************/
   async getProjectData(oneProExp: IResumeProfessionalExperienceModel) {
     const project: IResumeProjectDoneModel[] = [];
     for (const oneProject of this.projectList) {
       if (oneProject.ResumeProjectKey.professional_experience_code === oneProExp.ResumeProfessionalExperienceKey.professional_experience_code) {
         project.push({
           _id: oneProject._id,
           ResumeProjectKey: oneProject.ResumeProjectKey,
           start_date: oneProject.start_date,
           end_date: oneProject.end_date,
           project_title: oneProject.project_title,
           project_code: oneProject.ResumeProjectKey.project_code,
           professional_experience_code: oneProject.ResumeProjectKey.professional_experience_code,
           projectDetails: await this.getProjectDetailsData(oneProject),
         });
       }
     }
     return (project);
   }
  /**************************************************************************
   * @description get organized Project details data in JSON object
   * @param oneProject It contains the project relating to these project details
   * @return projectDetails returns the project details relating to one Project
   *************************************************************************/
   getProjectDetailsData(oneProject: IResumeProjectModel) {
    const projectDetails: IResumeProjectDetailsDoneModel[] = [];
    for (const oneProjectDetails of this.projectDetailsList) {
      if (oneProjectDetails.ResumeProjectDetailsKey.project_code === oneProject.ResumeProjectKey.project_code) {
        projectDetails.push({
          _id: oneProjectDetails._id,
          ResumeProjectDetailsKey: oneProjectDetails.ResumeProjectDetailsKey,
          project_detail_title: oneProjectDetails.project_detail_title,
          project_detail_desc: oneProjectDetails.project_detail_desc,
          project_details_code: oneProjectDetails.ResumeProjectDetailsKey.project_details_code,
          project_code: oneProjectDetails.ResumeProjectDetailsKey.project_code,
          projectDetailsSection:   this.getProjectDetailsSectionData(oneProjectDetails),
        });
      }
    }
    return (projectDetails);
  }
  /**************************************************************************
   * @description get organized Project details section data in JSON object
   * @param projectDetail it contains the project detail relating to these project details section
   * @return projectDetailsSection return the project details section of one project detail
   *************************************************************************/
  getProjectDetailsSectionData(projectDetail: IResumeProjectDetailsModel) {
    const projectDetailsSection: IResumeProjectDetailsSectionModel[] = [];
    for (const oneProjectDetailsSection of this.projectDetailsSectionList) {
      if (oneProjectDetailsSection.ResumeProjectDetailsSectionKey.project_details_code ===
        projectDetail.ResumeProjectDetailsKey.project_details_code) {
        projectDetailsSection.push({
          _id: oneProjectDetailsSection._id,
          ResumeProjectDetailsSectionKey: oneProjectDetailsSection.ResumeProjectDetailsSectionKey,
          project_details_section_desc: oneProjectDetailsSection.project_details_section_desc,
          project_details_code: oneProjectDetailsSection.ResumeProjectDetailsSectionKey.project_details_code,
          project_details_section_code: oneProjectDetailsSection.ResumeProjectDetailsSectionKey.project_details_section_code,
        });
      }
    }
    return(projectDetailsSection);
  }
  /**************************************************************************
   * @description get organized Project details section data in JSON object
   *************************************************************************/
  initSectionLists() {
  this.generalInfoList = [];
  this.proExpList = [];
  this.techSkillList = [];
  this.funcSkillList = [];
  this.interventionList = [];
  this.languageList = [];
  this.sectionList = [];
  this.certifList = [];
  this.projectList = [];
  this.projectDetailsList = [];
  this.projectDetailsSectionList = [];
}
  /**************************************************************************
   * @description translate static labels in the resume docx format
   *************************************************************************/
  translateDocs() {
  this.translateKey = [ 'resume-yrs-of-experience', 'resume-pro-exp', 'resume-certif-diploma'
    , 'resume-functional-skills', 'resume-technical-skills', 'resume-lvl-intervention', 'resume-language'
    , 'resume-phone', 'resume-email', 'resume-beginner', 'resume-elementary', 'resume-intermediate', 'resume-advanced', 'resume-expert'];
  this.translate.get(this.translateKey).subscribe(res => {
    this.label = {
      yearsOfExperience: res['resume-yrs-of-experience'],
      proExp: res['resume-pro-exp'],
      certifDiploma: res['resume-certif-diploma'],
      funcSkill: res['resume-functional-skills'],
      technicalSkill: res['resume-technical-skills'],
      intervention: res['resume-lvl-intervention'],
      language: res['resume-language'],
      phone: res['resume-phone'],
      email: res['resume-email'],
      beginner: res['resume-beginner'],
      elementary: res['resume-elementary'],
      intermediate: res['resume-intermediate'],
      advanced: res['resume-advanced'],
      expert: res['resume-expert'],
    };
  });
}
}
