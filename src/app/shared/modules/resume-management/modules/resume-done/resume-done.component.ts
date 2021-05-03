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
  posY = 0;

  constructor(
    private resumeService: ResumeService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    await this.getResumeInfo();
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
              this.getProjectInfo();
            });
        });
  }

  getProjectInfo() {
    this.proExpList.forEach(
      (proExpData) => {
        this.resumeService.getProject(
          `?professional_experience_code=${proExpData.ResumeProfessionalExperienceKey.professional_experience_code}`
        ).subscribe(
          (responseProject) => {
            console.log('project array', responseProject);
            responseProject.forEach(
              (responseProjectData) => {
                this.projectList.push(responseProjectData);
              }
            );
            this.getProjectDetailsInfo();
          });
      }
    );
  }

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

  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType);
  }

  public openPDF(): void {
    if (this.count > 13) {
      const doc = new jsPDF();
      doc.setTextColor(0, 0, 70);
      doc.setFont('calibri', 'bold');
      this.posY += 30;
      // @ts-ignore
      doc.text(this.generalInfoList[0].init_name, 100, this.posY, null, null, 'center');
      this.posY += 15;
      // @ts-ignore
      doc.text(this.generalInfoList[0].actual_job, 100, this.posY, null, null, 'center');
      try {
        doc.setTextColor(0, 0, 0);
        doc.setFont('calibri');
        doc.setFontSize(12);
        this.posY += 7;
        // @ts-ignore
        doc.text(this.generalInfoList[0].years_of_experience.toString() + ' years of experiences', 100, this.posY, null, null, 'center');
      } catch (e) {
        console.log('error=', e);
      }
      if (this.certifList.length !== undefined) {
        doc.setTextColor(173, 216, 230);
        this.posY += 22;
        doc.setFontSize(16);
        doc.setFillColor(135, 206, 235);
        doc.rect(20, this.posY - 6, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Diplomas/Certifications', 70, this.posY);
        this.certifList.forEach(
          (certifData) => {
            doc.setFont('courier');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            this.posY += 10;
            doc.setFillColor(0, 0, 0);
            doc.circle(23, this.posY - 1, 0.7, 'FD');
            doc.text(certifData.start_date + ' - ' + certifData.end_date + ':', 25, this.posY);
            doc.setFontSize(10);
            doc.text(certifData.diploma + ' from ' + certifData.establishment, 70, this.posY);
          }
        );
      }
      if (this.techSkillList.length !== undefined) {
        doc.setTextColor(173, 216, 230);
        this.posY += 15;
        doc.setFont('courier', 'bolditalic');
        doc.setFontSize(16);
        doc.setFillColor(135, 206, 235);
        doc.rect(20, this.posY - 6, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Technical Skills', 70, this.posY);
        this.techSkillList.forEach(
          (techData) => {
            doc.setFont('courier');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            this.posY += 10;
            doc.setFillColor(0, 0, 0);
            doc.circle(23, this.posY - 1, 0.7, 'FD');
            doc.text(techData.technical_skill_desc + ':', 25, this.posY);
            doc.setFontSize(10);
            doc.text(techData.technologies, 70, this.posY);
          }
        );
      }
      if (this.funcSkillList.length !== undefined) {
        console.log(this.funcSkillList, 'length');
        doc.setTextColor(173, 216, 230);
        this.posY += 15;
        doc.setFont('courier', 'bolditalic');
        doc.setFontSize(16);
        doc.setFillColor(135, 206, 235);
        doc.rect(20, this.posY - 6, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Functional Skills', 70, this.posY);
        this.funcSkillList.forEach(
          (funcData) => {
            doc.setFont('courier');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            this.posY += 10;
            doc.setFillColor(0, 0, 0);
            doc.circle(23, this.posY - 1, 0.7, 'FD');
            doc.text(funcData.skill, 25, this.posY);
          }
        );
      }
      if (this.interventionList.length !== undefined) {
        doc.setTextColor(173, 216, 230);
        this.posY += 15;
        doc.setFont('courier', 'bolditalic');
        doc.setFontSize(16);
        doc.setFillColor(135, 206, 235);
        doc.rect(20, this.posY - 6, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Level of Intervention', 70, this.posY);
        this.interventionList.forEach(
          (interventionData) => {
            doc.setFont('courier');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            this.posY += 10;
            doc.setFillColor(0, 0, 0);
            doc.circle(23, this.posY - 1, 0.7, 'FD');
            doc.text(interventionData.level_of_intervention_desc, 25, this.posY);
          }
        );
      }
      if (this.proExpList.length !== undefined) {
        doc.setTextColor(173, 216, 230);
        this.posY += 15;
        doc.setFont('courier', 'bolditalic');
        doc.setFontSize(16);
        doc.setFillColor(135, 206, 235);
        doc.rect(20, this.posY - 6, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);

        doc.text('Professional experience', 70, this.posY);
        this.proExpList.forEach(
          (proExpData) => {
            doc.setFont('courier');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            this.posY += 6;
            doc.setFillColor(255, 192, 203);
            doc.rect(20, this.posY - 4, 180, 8, 'F');
            doc.text(proExpData.ResumeProfessionalExperienceKey.start_date + ' - ' +
              proExpData.ResumeProfessionalExperienceKey.end_date + ':', 25, this.posY);
            doc.setFontSize(8);
            doc.text(proExpData.position + ' at ' + proExpData.customer, 70, this.posY);
            console.log('project list', this.projectList);
            this.projectList.forEach(
              (project) => {
                if (project.professional_experience_code === proExpData.professional_experience_code) {
                  doc.setFont('courier');
                  doc.setTextColor(0, 0, 0);
                  doc.setFontSize(8);
                  this.posY += 15;
                  doc.setFillColor(255, 192, 203);
                  doc.rect(80, this.posY - 4, 100, 8, 'F');
                  doc.text('Project:' + project.start_date + ' - ' + project.end_date + ':', 88, this.posY);
                  doc.setFontSize(8);
                  doc.text(project.project_title, 145, this.posY);
                  this.projectDetailsList.forEach(
                    (projectDetails) => {
                      if (projectDetails.project_code === project.project_code) {
                        doc.setFont('courier');
                        doc.setTextColor(0, 0, 0);
                        doc.setFontSize(8);
                        this.posY += 10;
                        doc.setTextColor(0, 128, 0);
                        doc.text(projectDetails.project_detail_title + ':', 100, this.posY);
                        doc.setFontSize(8);
                        if (projectDetails.project_detail_desc != null) {
                          doc.setTextColor(0, 0, 0);
                          doc.text(projectDetails.project_detail_desc, 140, this.posY);
                        } else {
                          this.projectDetailsSectionList.forEach(
                            (projectDetailsSection) => {
                              if (projectDetails.project_details_code === projectDetailsSection.project_details_code) {
                                doc.setTextColor(0, 0, 0);
                                doc.circle(138, this.posY - 1, 0.3, 'FD');
                                doc.text(projectDetailsSection.project_details_section_desc, 140, this.posY);
                                this.posY += 5;
                              }
                            });

                        }

                      }
                    }
                  );
                }
              }
            );
          });
        doc.output('dataurlnewwindow');
      } else {
        console.log('Resume is empty');
      }
    }
  }
}
