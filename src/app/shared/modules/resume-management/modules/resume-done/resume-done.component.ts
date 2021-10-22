import { Component , OnInit } from '@angular/core';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
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
import { DatePipe, formatDate } from '@angular/common';
import { UploadService } from '@core/services/upload/upload.service';
import { TranslateService } from '@ngx-translate/core';
import { IResumeCertificationModel } from '@shared/models/resumeCertification.model';
import { dataAppearance } from '@shared/animations/animations';
import { map } from 'rxjs/internal/operators/map';
import { Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { UploadResumeService } from '@core/services/upload-resume/upload-resume.service';
import { IContractor } from '@shared/models/contractor.model';
import { ContractorsService } from '@core/services/contractors/contractors.service';
import { IResumeDataModel } from '@shared/models/resumeData.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { IViewParam } from '@shared/models/view.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'wid-resume-done',
  templateUrl: './resume-done.component.html',
  styleUrls: ['./resume-done.component.scss'],
  animations: [
    dataAppearance,
  ]
})
export class ResumeDoneComponent implements OnInit {

  companyuserType: string;
  count = 0;
  resumeCode: string;
  generalInfoList: IResumeModel[];
  proExpList: IResumeProfessionalExperienceModel[];
  techSkillList: IResumeTechnicalSkillsModel[];
  funcSkillList: IResumeFunctionalSkillsModel[];
  interventionList: IResumeInterventionModel[];
  languageList: IResumeLanguageModel[];
  sectionList: IResumeSectionModel[];
  certifList: IResumeCertificationModel[];
  diplomaList: IResumeCertificationDiplomaModel[];
  projectList: IResumeProjectModel[];
  projectDetailsList: IResumeProjectDetailsModel[];
  projectDetailsSectionList: IResumeProjectDetailsSectionModel[];
  isLoading = new BehaviorSubject<boolean>(false);
  theme: string;
  years = 0;
  companyName: string;
  companyEmail: string;
  companyLogo: string;
  phone: string;
  dateNow: string;
  contactEmail: string;
  imageUrl: string;
  translateKey: string[];
  label: object;
  showEmpty = true;
  userType: string;
  contractorsList: IContractor [];
  testDateDiploma: string;
  subscriptionModal: Subscription;
  showWaiting: boolean;
  showWaitingPreview: boolean;
  showPage = false;
  mobile: string;
  refData: { } = { };
  langList: IViewParam[];
  /**********************************************************************
   * @description Resume Preview constructor
   *********************************************************************/
  constructor(
    private resumeService: ResumeService,
    private userService: UserService,
    private datePipe: DatePipe,
    private uploadResumeService: UploadResumeService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private modalServices: ModalService,
    private refDataService: RefdataService,
    private utilsService: UtilsService,
    private contractorsService: ContractorsService,
    private utilService: UtilsService,
    private uploadService: UploadService,
    private localStorageService: LocalStorageService,
  ) {
    this.resumeCode = this.router.getCurrentNavigation()?.extras?.state?.resumeCode;
    this.companyuserType   = this.router.getCurrentNavigation()?.extras?.state?.companyUserType;
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    this.showWaiting = false;
    this.showWaitingPreview = false;
    this.dateNow = new Date().getFullYear().toString();
    this.imageUrl = `${environment.uploadFileApiUrl}/image/`;
    this.verifyUserType();
    this.initSectionLists();
    this.translateDocs();
    this.getResumeInfo();

  }

  /**************************************************************************
   * @description Count the percentage of the resume
   * @return count returns the percentage reached of the resume
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
      this.count += 6;
    }
    if (this.diplomaList.length > 0) {
      this.count += 7;
    }
    if (this.languageList.length > 0) {
      this.count += 13;
    }
    this.showEmpty = false;
    return this.count;
  }
  /*************************************************************************
   * @description Get Resume Data from Resume Service
   *************************************************************************/
  getResumeInfo() {
    if (this.resumeCode) {
      this.userService.connectedUser$
        .subscribe(
          (userInfo) => {
            if (userInfo) {
              this.companyName = userInfo['company'][0]['company_name'];
              this.companyLogo = userInfo['company'][0]['photo'];
              this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
              this.phone = userInfo['company'][0]['phone_nbr1'];
              this.mobile = userInfo['company'][0]['phone_nbr2'];
              this.contactEmail = userInfo['company'][0]['contact_email'];
            }
          });
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
        this.resumeService.getCertification(
          `?resume_code=${this.resumeCode}`
        )
      ]).toPromise().then(
        async (data) => {
          if (data[0].length > 0) {
            if (data[0][0]['years_of_experience'] === null) {
              data[0][0]['years_of_experience'] = this.years;
            }
            // @ts-ignore
            this.generalInfoList = data[0];
          }
          if (data[1].length > 0) {
            // @ts-ignore
            this.proExpList = data[1].sort( (val1, val2) => {
              return +new Date(val1.ResumeProfessionalExperienceKey.start_date) - +new Date(val2.ResumeProfessionalExperienceKey.start_date);
            });
          }
          if (data[2].length > 0) {
            // @ts-ignore
            this.techSkillList = data[2];
          }
          if (data[3].length > 0) {
            // @ts-ignore
            this.languageList =  data[3].map( (language: IResumeLanguageModel) => {
              this.langList.map( (languageRefData) => {
                if (language.ResumeLanguageKey.resume_language_code === languageRefData.value) {
                  language.ResumeLanguageKey.resume_language_code = languageRefData.viewValue;
                }
              });
              return language;
            });          }
          if (data[4].length > 0) {
            // @ts-ignore
            this.interventionList = data[4];
          }
          if (data[5].length > 0) {
            // @ts-ignore
            this.funcSkillList = data[5];
          }
          if (data[6].length > 0) {
            // @ts-ignore
            this.sectionList = data[6];
          }
          if (data[7].length > 0) {
            // @ts-ignore
            this.diplomaList = data[7].sort( (val1, val2) => {
              return +new Date(val1.start_date) - +new Date(val2.start_date);
            });
          }
          if (data[8].length > 0) {
            // @ts-ignore
            this.certifList = data[8].sort( (val1, val2) => {
              return +new Date(val1.date) - +new Date(val2.date);
            });
          }
          this.countResume();
          // @ts-ignore
          await this.getProjectInfo(data[1]);
        });
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY' && !this.resumeCode) {
      this.router.navigate(['manager/resume/']);
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE' ||
      this.userService.connectedUser$.getValue().user[0].user_type === 'COLLABORATOR') {
      this.userService.connectedUser$
        .subscribe(
          (userInfo) => {
            if (userInfo) {
              this.companyName = userInfo['company'][0]['company_name'];
              this.companyLogo = userInfo['company'][0]['photo'];
              this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
              this.phone = userInfo['company'][0]['phone_nbr1'];
              this.contactEmail = userInfo['company'][0]['contact_email'];
            }
          });
      this.resumeService.getResume(
        `?email_address=${this.userService.connectedUser$
          .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
          .getValue().user[0]['company_email']}`).subscribe((response) => {
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
          this.resumeService.getCertification(
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
              this.proExpList = data[1].sort( (val1, val2) => {
                return +new Date(val1.ResumeProfessionalExperienceKey.start_date) - +new Date(val2.ResumeProfessionalExperienceKey.start_date);
              });
              // @ts-ignore
               this.getProjectInfo(data[1]);
            } else {
              this.proExpList = [];
              this.showPage = true;
            }
            if (data[2].length > 0) {
              // @ts-ignore
              this.techSkillList = data[2];
            }
            if (data[3].length > 0) {
              this.resumeService.getResume(`?resume_code=${data[3][0]['ResumeLanguageKey'].resume_code}`).subscribe( async (companyEmail) => {
                await this.getLanguageRefData(companyEmail[0].ResumeKey.company_email).then( (res) => {
                  // @ts-ignore
                  this.languageList =  data[3].map( (language: IResumeLanguageModel) => {
                    this.langList.map( (languageRefData) => {
                      if (language.ResumeLanguageKey.resume_language_code === languageRefData.value) {
                        language.ResumeLanguageKey.resume_language_code = languageRefData.viewValue;
                      }
                    });
                    return language;
                });
              });

              });
            }
            if (data[4].length > 0) {
              // @ts-ignore
              this.interventionList = data[4];
            }
            if (data[5].length > 0) {
              // @ts-ignore
              this.funcSkillList = data[5];
            }
            if (data[6].length > 0) {
              // @ts-ignore
              this.sectionList = data[6];
            }
            if (data[7].length > 0) {
              // @ts-ignore
              this.diplomaList = data[7].sort( (val1, val2) => {
                return +new Date(val1.start_date) - +new Date(val2.start_date);
              });
            }
            if (data[8].length > 0) {
              // @ts-ignore
              this.certifList = data[8].sort( (val1, val2) => {
                return +new Date(val1.date) - +new Date(val2.date);
              });
            }
            this.countResume();
            // @ts-ignore
            this.getContractorsList(this.generalInfoList[0].ResumeKey.company_email);
          });
      });
    }

  }
  /**************************************************************************
   * @description Get Project Data from Resume Service
   *************************************************************************/
  getProjectInfo(professionalExperienceData: IResumeProfessionalExperienceModel[]) {
    let projectFinalList = [];
    new Promise((resolve, reject) => {
      if (this.proExpList.length > 0) {
        professionalExperienceData.forEach(
          (proExpData, index) => {
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
                  if (this.proExpList.length === index + 1) {
                    this.projectList = this.projectList.sort( (val1, val2) => {
                      return +new Date(val1.start_date) - +new Date(val2.start_date);
                    });
                    resolve(this.projectList);
                  }
                  projectFinalList = [];
                  projectFinalList = this.projectList;
                }
              });
          }
        );
      }
    }).then((result: IResumeProjectModel[]) => {
      if (result.length > 0 ) {
        this.getProjectDetailsInfo(result);
      } else {
        this.showPage = true;
      }
    });
  }
  /**************************************************************************
   * @description Upload Image to Upload api  with async to promise
   * @param formData It contains the resume in docx format
   * @return res return the image uploaded
   *************************************************************************/
  async uploadFile(formData) {
    return await this.uploadResumeService.uploadResume(formData)
      .pipe(
         map(response => response.filename)
      )
      .toPromise();
  }
  async uploadCompanyFile(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }
  /**************************************************************************
   * @description Upload Image to Resume list api  with async to promise
   * @param formData It contains the resume in docx format
   * @return res return the image uploaded
   *************************************************************************/
  async updateUploadFile(formData) {
    return await this.uploadResumeService.updateResume(formData)
      .pipe(
        map(response => response.filename)
      )
      .toPromise();
  }
  /**************************************************************************
   * @description Get Project Details Data from Resume Service
   *************************************************************************/
  getProjectDetailsInfo(projectListData: IResumeProjectModel[]) {
    const ProDet = new Promise((resolve, reject) => {
      if (projectListData.length > 0) {
        projectListData.forEach(
          (projectData, index) => {
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
                  if (this.projectList.length === index + 1) {
                    resolve(this.projectDetailsList);
                  }
                }
              });
          }
        );
      }
    }).then(async (res: IResumeProjectDetailsModel[]) => {
      if (res.length > 0) {
        await this.getProjectDetailsSectionInfo(res);
      } else {
        this.showPage = false;
      }
    });
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async getProjectDetailsSectionInfo(projectDetailsList: IResumeProjectDetailsModel[]) {
    if (projectDetailsList.length > 0) {
      let index = 0;
      for (const projectDetailsData of projectDetailsList) {
        index ++;
        await this.resumeService.getProjectDetailsSection(
          `?project_details_code=${projectDetailsData.ResumeProjectDetailsKey.project_details_code}`
        ).subscribe(
          (responseProjectDetailsSection) => {
            if (responseProjectDetailsSection.length > 0) {
              responseProjectDetailsSection.forEach(
                (responseProjectDetailsSectionData) => {
                  this.projectDetailsSectionList.push(responseProjectDetailsSectionData);
                }
              );
            }
          });
      }
    }
    this.showPage = true;
  }
  /**************************************************************************
   * @description Get All resume Data
   * @param action  which differs between the generation in pdf or docx format
   *************************************************************************/
  async getDocument(action: string) {
    if (this.diplomaList.length > 0) {
      this.diplomaList.forEach((diploma) => {
          diploma.start_date = this.datePipe.transform(diploma.start_date, 'yyyy');
          diploma.end_date = this.datePipe.transform(diploma.end_date, 'yyyy');
      });
    }
    if (this.certifList.length > 0) {
      this.certifList.forEach((certif) => {
        certif.date = this.datePipe.transform(certif.date, 'yyyy');
      });
    }
    if (this.proExpList.length > 0) {
      this.proExpList.forEach((pro) => {
        if (pro.ResumeProfessionalExperienceKey.end_date === 'Current Date') {
          this.translate.get(`resume-today`).subscribe( (data) => {
            pro.ResumeProfessionalExperienceKey.end_date = data;
          });
        } else {
          console.log(this.localStorageService.getItem('language').langCode === 'EN');
            pro.ResumeProfessionalExperienceKey.end_date = this.localStorageService.getItem('language').langCode === 'FR' ?
              formatDate(pro.ResumeProfessionalExperienceKey.end_date
            .replace('/', '-'), 'MMMM yyyy' , 'fr-CA')
            : this.datePipe.transform(pro.ResumeProfessionalExperienceKey.end_date, 'MMMM yyyy');
        }
        pro.ResumeProfessionalExperienceKey.start_date = this.localStorageService.getItem('language').langCode === 'FR' ?
          formatDate(pro.ResumeProfessionalExperienceKey.start_date
          .replace('/', '-'), 'MMMM yyyy' , 'fr-CA')
          : this.datePipe.transform(pro.ResumeProfessionalExperienceKey.start_date, 'MMMM yyyy');
      });
    }
    if (this.projectList.length > 0) {
      this.projectList.forEach((proj) => {
        proj.start_date = this.datePipe.transform(proj.start_date, 'yyyy-MM-dd');
        proj.end_date = this.datePipe.transform(proj.end_date, 'yyyy-MM-dd');
      });
    }
    const dataCompany = {
      person: {
        application_id: this.generalInfoList[0].ResumeKey.application_id,
        collaborator_email: this.generalInfoList[0].ResumeKey.email_address,
        name: this.generalInfoList[0].init_name,
        role: this.generalInfoList[0].actual_job,
        experience: this.generalInfoList[0].years_of_experience ?
          this.generalInfoList[0].years_of_experience : this.calculateYearsOfExperience() ?
            this.calculateYearsOfExperience() : 0,
        phoneNum: this.phone?.toString() ? this.phone?.toString() : '',
        label: this.label,
        mobile: this.mobile?.toString() ? this.mobile?.toString() : '',
        currentYear: this.dateNow,
        imageUrl: this.generalInfoList[0].image ? this.imageUrl + this.generalInfoList[0].image : null ,
        diplomas: this.diplomaList,
        certifications: this.certifList,
        company_name: this.companyName,
        company_email: this.companyEmail,
        company_logo:  this.imageUrl + this.companyLogo,
        contact_email: this.contactEmail,
        technicalSkills: this.techSkillList,
        functionnalSkills: this.funcSkillList,
        intervention: this.interventionList,
        pro_exp: await this.organizeDataProExp(),
        language: this.languageList,
        section: this.sectionList,
      }
    };
    const dataCollaborator: IResumeDataModel = {
      ResumeDataKey: {
        application_id: this.generalInfoList[0].ResumeKey.application_id,
        resume_code: this.generalInfoList[0].ResumeKey.resume_code,
        collaborator_email: this.generalInfoList[0].ResumeKey.email_address,
        company_email: this.generalInfoList[0].ResumeKey.company_email,
      },
      name: this.generalInfoList[0].init_name,
      role: this.generalInfoList[0].actual_job,
      experience: this.generalInfoList[0].years_of_experience || this.calculateYearsOfExperience() || 0,
      image_url: this.generalInfoList[0].image ? this.imageUrl + this.generalInfoList[0].image : null ,
      diplomas: this.diplomaList.reverse(),
      certifications: this.certifList.reverse(),
      technical_skills: this.techSkillList,
      functional_skills: this.funcSkillList,
      intervention: this.interventionList,
      professional_experiences: await this.organizeDataProExp(),
      languages: this.languageList,
      sections: this.sectionList,
      update: true,
      user_type: 'COLLABORATOR',
      application_id: this.generalInfoList[0].ResumeKey.application_id,
      resume_code: this.generalInfoList[0].ResumeKey.resume_code,
      collaborator_email: this.generalInfoList[0].ResumeKey.email_address,
      company_email: this.generalInfoList[0].ResumeKey.company_email,
    };
    await this.downloadDocs(dataCompany,  action, dataCollaborator);
  }
  /**************************************************************************
   * @description generate Resume in docx format or in PDF format
   * @param dataCollaborator it contains the collaborator data
   * @param action which differs between the generation in pdf or docx format
   * @param dataCompany it contains the necessary data for the Resume
   *************************************************************************/
  downloadDocs(dataCompany: object,  action: string, dataCollaborator?: IResumeDataModel) {
    if (action === 'generate') {
      if (this.userService.connectedUser$.getValue().user[0].user_type === 'COLLABORATOR' || this.companyuserType === 'COLLABORATOR') {
        const confirmation = {
          code: 'edit',
          title: 'Send Email',
          description: `Are you sure you want to save your resume`,
        };
        this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '550px', '350px')
          .subscribe(
            (resMail) => {
              if (resMail === true) {
                this.showWaiting = true;
                this.resumeService.generateResumeCompany(dataCompany, action)
                  .subscribe(async (result) => {
                    saveAs(result, `${this.generalInfoList[0].init_name}.docx`);
                  /*const file = new File([result], `${this.generalInfoList[0].init_name}.docx`,
                      { lastModified: new Date().getTime(), type: 'docx'});
                    const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
                    formData.append('file', file);
                    formData.append('caption', file.name);
                    await this.uploadCompanyFile(formData).then(async (filename) => {
                      this.generalInfoList[0].resume_filename_docx = filename;
                      this.generalInfoList[0].email_address = this.generalInfoList[0].ResumeKey.email_address;
                      this.generalInfoList[0].application_id = this.generalInfoList[0].ResumeKey.application_id;
                      this.generalInfoList[0].company_email = this.generalInfoList[0].ResumeKey.company_email;
                      this.generalInfoList[0].language_id = this.generalInfoList[0].ResumeKey.language_id;
                      this.generalInfoList[0].resume_code = this.generalInfoList[0].ResumeKey.resume_code;
                      this.resumeService.updateResume(this.generalInfoList[0]).subscribe((generalInfo) => {
                        if (!this.companyuserType) {
                          this.resumeService
                            .sendMailManager('5eac544ad4cb666637fe1354',
                              this.generalInfoList[0].application_id,
                              this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
                              this.companyEmail,
                              this.companyName,
                              this.userService.connectedUser$.getValue().user[0]['first_name'] + ' ' +
                              this.userService.connectedUser$.getValue().user[0]['last_name'],
                              [{
                                filename: this.generalInfoList[0].init_name + '.docx',
                                path: `${environment.uploadFileApiUrl}/show/${this.generalInfoList[0].resume_filename_docx}`
                              }, ]
                            ).subscribe((dataB) => {
                            console.log('mail sended');
                          });
                        }
                          this.showWaiting = false;
                          this.resumeService.getResumeData(`?resume_code=${dataCollaborator.ResumeDataKey.resume_code}`)
                            .subscribe( (resumeData) => {
                              if (resumeData['msg_code'] === '0004') {
                                this.resumeService.addResumeData(dataCollaborator).subscribe( (resume) => {
                                  console.log('resume Data added', resume);
                                });
                              } else {
                                dataCollaborator.application_id = dataCollaborator.ResumeDataKey.application_id;
                                dataCollaborator.resume_code = dataCollaborator.ResumeDataKey.resume_code;
                                dataCollaborator.collaborator_email = dataCollaborator.ResumeDataKey.collaborator_email;
                                dataCollaborator.company_email = dataCollaborator.ResumeDataKey.company_email;
                                this.resumeService.updateResumeData(dataCollaborator).subscribe( (resume) => {
                                  console.log('resume Data updated', resume);
                                });
                              }
                            });
                          this.router.navigate(['/candidate/']);
                        });
                      });*/
                    this.subscriptionModal.unsubscribe();
                  });
                this.subscriptionModal.unsubscribe();
              }
            });
      } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE' || this.companyuserType === 'CANDIDATE') {
        const confirmation = {
          code: 'edit',
          title: 'Send Email',
          description: `Are you sure you want to save your resume ? It will be sent to the company `,
        };
        this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '550px', '350px')
          .subscribe(
            (resMail) => {
              if (resMail === true) {
                this.showWaiting = true;
                this.resumeService.generateResumeCompany(dataCompany, action).subscribe(async (result) => {
                  saveAs(result, `${this.generalInfoList[0].init_name}.docx`);
                  const file = new File([result], `${this.generalInfoList[0].init_name}.docx`,
                    { lastModified: new Date().getTime(), type: 'docx'});
                  const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
                  formData.append('file', file);
                  formData.append('caption', file.name);
                  await this.uploadCompanyFile(formData).then(async (filename) => {
                      this.generalInfoList[0].resume_filename_docx = filename;
                      this.generalInfoList[0].email_address = this.generalInfoList[0].ResumeKey.email_address;
                      this.generalInfoList[0].application_id = this.generalInfoList[0].ResumeKey.application_id;
                      this.generalInfoList[0].company_email = this.generalInfoList[0].ResumeKey.company_email;
                      this.generalInfoList[0].language_id = this.generalInfoList[0].ResumeKey.language_id;
                      this.generalInfoList[0].resume_code = this.generalInfoList[0].ResumeKey.resume_code;
                      this.resumeService.updateResume(this.generalInfoList[0]).subscribe((generalInfo) => {
                        if (!this.companyuserType) {
                          this.resumeService
                            .sendMailManager('5eac544ad4cb666637fe1354',
                              this.generalInfoList[0].application_id,
                              this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL')),
                              this.companyEmail,
                              this.companyName,
                              this.userService.connectedUser$.getValue().user[0]['first_name'] + ' ' +
                              this.userService.connectedUser$.getValue().user[0]['last_name'],
                              [{
                                filename: this.generalInfoList[0].init_name + '.docx',
                                path: `${environment.uploadFileApiUrl}/show/${this.generalInfoList[0].resume_filename_docx}`
                              }, ]
                            ).subscribe((dataB) => {
                            console.log('email sended');
                          });
                        }
                        this.resumeService.getResumeData(`?resume_code=${dataCollaborator.ResumeDataKey.resume_code}`)
                          .subscribe( (resumeData) => {
                            dataCollaborator.user_type = 'CANDIDATE';
                            if (resumeData['msg_code'] === '0004') {
                              this.resumeService.addResumeData(dataCollaborator).subscribe( (resume) => {
                                console.log('resume Data added', resume);
                              });
                            } else {
                              dataCollaborator.application_id = dataCollaborator.ResumeDataKey.application_id;
                              dataCollaborator.resume_code = dataCollaborator.ResumeDataKey.resume_code;
                              dataCollaborator.collaborator_email = dataCollaborator.ResumeDataKey.collaborator_email;
                              dataCollaborator.company_email = dataCollaborator.ResumeDataKey.company_email;
                              this.resumeService.updateResumeData(dataCollaborator).subscribe( (resume) => {
                                console.log('resume Data updated', resume);
                              });
                            }
                          });
                          this.showWaiting = false;
                          this.router.navigate(['/candidate/']);
                      });
                    });

                  this.subscriptionModal.unsubscribe();
                });
              }
            });
      }
    } else if (action === 'preview') {
      this.showWaitingPreview = true;
      this.resumeService.generateResumeCompany(dataCompany, action).subscribe(
      async res => {
          const fileURL = URL.createObjectURL(res);
          this.showWaitingPreview = false;
          window.open(fileURL, '_blank');
          this.count = 0;
        this.initSectionLists();
        this.getResumeInfo();
      });
      }
  }
  /**************************************************************************
   * @description get organized Professional experience data in JSON object
   * @return proExpData return the professional experience relating to this candidates
   *************************************************************************/
  async organizeDataProExp(): Promise<IResumeProfessionalExperienceDoneModel[]> {
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
    return (proExpData.reverse());
  }
  /**************************************************************************
   * @description get organized Project data in JSON object
   * @param oneProExp it contains the professional experience relating to these projects
   * @return project returns the projects relating to one professional experience
   *************************************************************************/
  async getProjectData(oneProExp: IResumeProfessionalExperienceModel): Promise<IResumeProjectDoneModel[]> {
    const project: IResumeProjectDoneModel[] = [];
    for (const oneProject of this.projectList) {
      if (oneProject.ResumeProjectKey.professional_experience_code === oneProExp.ResumeProfessionalExperienceKey.professional_experience_code) {
        project.push({
          _id: oneProject._id,
          ResumeProjectKey: oneProject.ResumeProjectKey,
          start_date: oneProject.start_date,
          end_date: oneProject.end_date,
          project_title: oneProject.project_title,
          client: oneProject.client,
          position: oneProject.position,
          project_code: oneProject.ResumeProjectKey.project_code,
          professional_experience_code: oneProject.ResumeProjectKey.professional_experience_code,
          projectDetails:  await this.getProjectDetailsData(oneProject),
        });
      }
    }
    return (project.reverse());
  }
  /**************************************************************************
   * @description get organized Project details data in JSON object
   * @param oneProject It contains the project relating to these project details
   * @return projectDetails returns the project details relating to one Project
   *************************************************************************/
  async getProjectDetailsData(oneProject: IResumeProjectModel): Promise<IResumeProjectDetailsDoneModel[]> {
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
          projectDetailsSection: await this.getProjectDetailsSectionData(oneProjectDetails),
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
  async getProjectDetailsSectionData(projectDetail: IResumeProjectDetailsModel): Promise<IResumeProjectDetailsSectionModel[]> {
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
    return (projectDetailsSection);
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
    this.diplomaList = [];
    this.projectList = [];
    this.projectDetailsList = [];
    this.projectDetailsSectionList = [];
  }
  /**************************************************************************
   * @description translate static labels in the resume docx format
   *************************************************************************/
  translateDocs() {
    this.translateKey = ['resume-yrs-of-experience', 'resume-pro-exp', 'resume-certif-diploma'
      , 'resume-functional-skills', 'resume-technical-skills', 'resume-lvl-intervention', 'resume-language'
      , 'resume-phone', 'resume-email', 'resume-beginner', 'resume-elementary', 'resume-intermediate',
      'resume-advanced', 'resume-expert', 'resume-until'];
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
        until: res['resume-until'],
      };
    });
  }
  /**************************************************************************
   * @description verify the type of the connected user
   *************************************************************************/
  verifyUserType() {
    this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY' ? this.userType = 'manager' : this.userType = 'candidate';
  }
  /**************************************************************************
   * @description Get list of contractors
   * @param company_email: The company email of the user
   *************************************************************************/
  getContractorsList(company_email: string) {
    this.contractorsService.getContractors(
      `?email_address=${company_email}`).subscribe((res) => {
      this.contractorsList = res['results'];
    });
  }
    /**************************************************************************
     * @description Calculate the sum of the years of experiences
     *************************************************************************/
    calculateYearsOfExperience() {
    const maxDate = new Date(Math.max.apply(null, this.proExpList.map (proExp => {
      if (proExp.ResumeProfessionalExperienceKey.end_date === 'Today') {
        return new Date();
      } else {
        return new Date(proExp.ResumeProfessionalExperienceKey.end_date);
      }
    })));
    const minDate = new Date(Math.min.apply(null, this.proExpList.map (proExp => {
      return new Date(proExp.ResumeProfessionalExperienceKey.start_date);
    })));
    return(maxDate.getFullYear() - minDate.getFullYear());

  }
  /**************************************************************************
   * @description set Language RefData in a language List
   *************************************************************************/
  async getLanguageRefData(companyEmail) {
    const data = await this.getRefData(companyEmail);
    this.langList = data['LANGUAGE'];
  }
  /**************************************************************************
   * @description Get Languages from Ref Data
   * @return refData return language refData
   *************************************************************************/
  async getRefData(companyEmail) {
    const list = ['LANGUAGE'];
    this.refData = await this.refDataService
      .getRefData(this.utilService
          .getCompanyId(companyEmail, this.userService.applicationId), this.userService.applicationId,
        list, false);
    return this.refData;
  }
}
