import { Component, OnInit } from '@angular/core';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { forkJoin, ObservedValuesFromArray } from 'rxjs';
import { IResumeModel } from '@shared/models/resume.model';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { FormGroup } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { IResumeProjectDetailsModel } from '@shared/models/resumeProjectDetails.model';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { UploadService } from '@core/services/upload/upload.service';
import { takeUntil } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'wid-resume-done',
  templateUrl: './resume-done.component.html',
  styleUrls: ['./resume-done.component.scss']
})
export class ResumeDoneComponent implements OnInit {
  count = 0;
  resume_code: string;
  generalInfoList: IResumeModel[] = [];
  proExpList: IResumeProfessionalExperienceModel[] = [];
  techSkillList: IResumeTechnicalSkillsModel[] = [];
  funcSkillList: IResumeFunctionalSkillsModel[] = [];
  interventionList: IResumeInterventionModel[] = [];
  languageList: IResumeLanguageModel[] = [];
  sectionList: IResumeSectionModel[] = [];
  certifList: IResumeCertificationDiplomaModel[] = [];
  projectList: IResumeProjectModel[] = [];
  projectDetailsList: IResumeProjectDetailsModel[] = [];
  projectDetailsSectionList: IResumeProjectDetailsSectionModel[] = [];
  constructor(
    private resumeService: ResumeService,
    private userService: UserService,
    private datepipe: DatePipe,
    private uploadService: UploadService,
  ) {
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    await this.getResumeInfo();
  }
  /**************************************************************************
   * @description Count the percentage of the resume
   *************************************************************************/
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
  /**************************************************************************
   * @description Get Resume Data from Resume Service
   *************************************************************************/
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
                // @ts-ignore
              this.generalInfoList = data[0]; }
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
    console.log('get project info and length pro exp', this.proExpList.length);
    if (this.proExpList.length > 0) {
    this.proExpList.forEach(
      (proExpData) => {
        this.resumeService.getProject(
          `?professional_experience_code=${proExpData.ResumeProfessionalExperienceKey.professional_experience_code}`
        ).subscribe(
          (responseProject) => {
            console.log('project array', proExpData.ResumeProfessionalExperienceKey.professional_experience_code);
            if (responseProject['msg_code'] !== '0004') {
                responseProject.forEach(
                (responseProjectData) => {
                  this.projectList.push(responseProjectData);
                }
              );
              this.getProjectDetailsInfo();
            }
          });
      }
    ); }
  }

  /**************************************************************************
   * @description Upload Image to Server  with async to promise
   *************************************************************************/
  async uploadFile(res) {
    const file = res;
    // File Preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
    formData.append('file', file);
    formData.append('caption',  `${this.generalInfoList[0].init_name}.docx`);
    return this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }
  /**************************************************************************
   * @description Get Project Details Data from Resume Service
   *************************************************************************/
  getProjectDetailsInfo() {
    this.projectList.forEach(
      (projectData) => {
        this.resumeService.getProjectDetails(
          `?project_code=${projectData.ResumeProjectKey.project_code}`
        ).subscribe(
          (responseProjectDetails) => {
            console.log('project array', responseProjectDetails);
            responseProjectDetails.forEach(
              (responseProjectDetailsData) => {
                this.projectDetailsList.push(responseProjectDetailsData);
              }
            );
            this.getProjectDetailsSectionInfo();
          });
      }
    );
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  getProjectDetailsSectionInfo() {
    this.projectDetailsList.forEach(
      (projectDetailsData) => {
        this.resumeService.getProjectDetailsSection(
          `?project_details_code=${projectDetailsData.ResumeProjectDetailsKey.project_details_code}`
        ).subscribe(
          (responseProjectDetailsSection) => {
            console.log('project array', responseProjectDetailsSection);
            responseProjectDetailsSection.forEach(
              (responseProjectDetailsSectionData) => {
                this.projectDetailsSectionList.push(responseProjectDetailsSectionData);
              }
            );
          });
      }
    );
  }
  /**************************************************************************
   * @description Get Cv Document in Docx format and the user chose if he want to save it in dataBase or just check it
   *************************************************************************/
  getDocument(action: string) {
    console.log('project = ', this.projectList);
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
    console.log('certif=', this.certifList);
    console.log(this.languageList);
    const data = {
      person: {
        name: this.generalInfoList[0].init_name,
        role: this.generalInfoList[0].actual_job,
        experience: this.generalInfoList[0].years_of_experience.toString(),
        imageUrl: this.generalInfoList[0].image.toString(),
        diplomas: this.certifList,
        technicalSkills: this.techSkillList,
        functionnalSkills: this.funcSkillList,
        intervention: this.interventionList,
        pro_exp: this.proExpList,
        project: this.projectList,
        project_details: this.projectDetailsList,
        project_details_section: this.projectDetailsSectionList,
        language: this.languageList,
        section: this.sectionList,
      }
    };
    this.resumeService.getResumePdf(data, 'wid')
      .subscribe(
        async res => {
          if (action === 'preview') {
            saveAs(res, `${this.generalInfoList[0].init_name}.docx`);
          } else if (action === 'save') {
            const resumeName = await this.uploadFile(res);
            console.log(resumeName);
          }
    },
      (error) => {
        console.log(error);
      }
    );
/*
      this.downLoadFile(res, 'application/ms-excel');
*/

  }

}
