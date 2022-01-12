import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ResumeService } from '@core/services/resume/resume.service';
import { Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { CollaboratorService } from '@core/services/collaborator/collaborator.service';
import { CandidateService } from '@core/services/candidate/candidate.service';
import { ICollaborator } from '@shared/models/collaborator.model';
import { IUserModel } from '@shared/models/user.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { MailingModalComponent } from '@shared/components/mailing-modal/mailing-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { IResumeModel } from '@shared/models/resume.model';

import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'wid-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  subscriptionModal: Subscription;
  modals = { modalName: 'mailing', modalComponent: MailingModalComponent };
  clientEmailAddress: string;
  nbtItems = new BehaviorSubject<number>(5);
  constructor(
    private userService: UserService,
    private resumeService: ResumeService,
    private router: Router,
    private translateService: TranslateService,
    private modalServices: ModalService,
    private collaboratorService: CollaboratorService,
    private candidateService: CandidateService,
    private utilsService: UtilsService,
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
  ) {
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit(): Promise<void> {
    this.modalService.registerModals(this.modals);
    this.clientEmailAddress = 'khmayesbounguicha@gmail.com';
await this.getData(0, this.nbtItems.getValue());
  }
  /**************************************************************************
   * @description Get Users Data  from user service and resume service
   *************************************************************************/
  async getData(offset, limit) {
    this.isLoading.next(true);
    const blocData = [];
    let index = 1;
    this.userService.connectedUser$
      .subscribe((userInfo) => {
         this.resumeService
          .getResumeDataTable(`?company_email=${userInfo?.company[0].companyKey.email_address}&beginning=${offset}&number=${limit}`)
          .subscribe((resume) => {
            resume['results'].map( (oneResume: IResumeModel) => {
              this.userService
                .getAllUsers(`?company_email=${userInfo?.company[0].companyKey.email_address}&email_address=${oneResume.ResumeKey.email_address}`)
                .subscribe(async (user) => {
                    return new Promise((resolve) => {
                      if (user['msg_code'] !== '0004') {
                        blocData.push({
                          resume_name: user['results'][0].first_name + ' ' + user['results'][0].last_name,
                          resume_years_exp: oneResume.years_of_experience,
                          resume_position: oneResume.actual_job,
                          resume_status: oneResume.status,
                          resume_email: user['results'][0].userKey.email_address,
                          resume_user_type: user['results'][0].user_type,
                          resume_filename_docx: oneResume.resume_filename_docx,
                          resume_filename_pdf: oneResume.resume_filename_pdf,
                          user_info: oneResume,
                          first_name: user['results'][0].first_name,
                          last_name: user['results'][0].last_name,
                        });
                      }
                      index++;
                      if (index > resume['results'].length) {
                        resume['results'] = blocData;
                        console.log('resume =', resume);
                        resolve(resume);
                      }
                    }).then((result) => {
                      this.isLoading.next(false);
                      this.tableData.next(result);
                    });

                  });
                });
            });
          });
  }
  /**************************************************************************
   To change
   *************************************************************************/
  switchAction(rowAction: any) {
     this.translateService.get(['resume-change-status', 'send-mail', 'export-pdf', 'downlaod-docx', 'resume-archive']).subscribe( (res) => {
      switch (rowAction.actionType) {
        case (res['resume-change-status']):
          this.changeCandidateToCollaborator(rowAction.data);
          break;
        case ('update'):
          this.updateResume(rowAction.data);
          break;
        case(res['send-mail']):
          this.sendMail(rowAction.data);
          break;
        case(res['export-pdf']):
          this.exportPdf(rowAction.data);
          break;
        case(res['downlaod-docx']):
          this.downloadDocx(rowAction.data);
          break;
        case(res['resume-archive']):
          this.archiveUser(rowAction.data);
          break;
      }
    });

  }
  /**************************************************************************
   * @description Export Resume in pdf format
   * @param data: contains the data of resume
   *************************************************************************/
  exportPdf(data) {
    this.translateService.get(['manager.resume.export', 'manager.resume.noexist']).subscribe( (resTranslate) => {
      data.map( (exportPdfData) => {
        if (exportPdfData.resume_filename_docx !== undefined && exportPdfData.resume_filename_docx !== null) {
          this.resumeService.convertResumeToPdf(environment.uploadFileApiUrl + '/show/' + exportPdfData.resume_filename_docx).subscribe((pdf) => {
            const fileURL = URL.createObjectURL(pdf);
            window.open(fileURL, '_blank');
          });
        } else {
          const confirmation = {
            code: 'info',
            title: 'manager.resume.exportcv',
            // tslint:disable-next-line:max-line-length
            description: `${resTranslate['manager.resume.export']} ${exportPdfData.first_name} ${exportPdfData.last_name} ${resTranslate['manager.resume.noexist']}`,
          };
          this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
            .subscribe(
              (res) => {
                if (res === true) {
                }
                this.subscriptionModal.unsubscribe();
              }
            );
        }
      });
    });
  }
  /**************************************************************************
   * @description Update the resume of user
   * @param data contain the resume resume date of the user
   *************************************************************************/
  private updateResume(data) {
    data.user_info.resume_code = data.user_info.ResumeKey.resume_code;
    data.user_info.language_id = data.user_info.ResumeKey.language_id;
    data.user_info.company_email = data.user_info.ResumeKey.company_email;
    data.user_info.email_address = data.user_info.ResumeKey.email_address;
    data.user_info.application_id = data.user_info.ResumeKey.application_id;
    this.router.navigate(['/manager/resume/generalInformation'],
      {
        state: {
          generalInformation: data.user_info,
          firstName: data.first_name,
          lastName: data.last_name,
          user_type: data.resume_user_type,
        }
      });
  }
  /**************************************************************************
   * @description Download resume in Docx format
   * @param data: contains the data of resume
   *************************************************************************/
  private downloadDocx(data) {
    this.translateService.get(['manager.resume.download', 'manager.resume.noexist']).subscribe( (resTranslate) => {
      data.map ( (downloadDocxData) => {
        if (downloadDocxData.resume_filename_docx !== undefined && downloadDocxData.resume_filename_docx !== null) {
          window.location.href = environment.uploadFileApiUrl + '/show/' + downloadDocxData.resume_filename_docx;
        } else {
          const confirmation = {
            code: 'info',
            title: 'manager.resume.exportcv',
            // tslint:disable-next-line:max-line-length
            description: `${resTranslate['manager.resume.download']} ${downloadDocxData.first_name} ${downloadDocxData.last_name}  ${resTranslate['manager.resume.noexist']}`,
          };
          this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
            .subscribe(
              (res) => {
                if (res === true) {
                }
                this.subscriptionModal.unsubscribe();
              }
            );
        }
      });
    });
  }
  /**************************************************************************
   * @description Send mail contains the resume of the collaborator to client
   * data: contains the data of resume
   *************************************************************************/
  private sendMail(data) {
    this.subscriptionModal = this.modalServices.displayModal('mailing', data, '500px', '640px')
      .subscribe(
        (res) => {
          console.log('mailing dialog', res);
        });
  }
  /**************************************************************************
   * @description Change status of candidate to collaborator
   * data: contains the data of user
   *************************************************************************/
  changeCandidateToCollaborator(data) {
      const confirmation = {
        code: 'edit',
        title: 'cand-collab',
        description: `resume-u-sure`,
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '550px', '350px')
        .subscribe(
          (res) => {
            if (res === true) {
              data.map( (changeStatusData) => {

                this.isLoading.next( true);
              this.tableData.next([]);
              this.candidateService.getCandidate(`?email_address=${changeStatusData.user_info.ResumeKey.email_address}`)
                .subscribe((candidateData) => {
                const collaborator: ICollaborator = {
                  collaboratorKey: {
                    application_id: candidateData[0].candidateKey.application_id,
                    email_address: candidateData[0].candidateKey.email_address,
                  },
                  adress: candidateData[0].adress ? candidateData[0].adress : null,
                  zip_code: candidateData[0].zip_code ? candidateData[0].zip_code : null,
                  country_id: candidateData[0].country_code ? candidateData[0].country_code : null,
                  family_situation_id: null,
                  nationality_id: candidateData[0].nationality_id ? candidateData[0].nationality_id : null,
                  birth_date: candidateData[0].birth_date ? candidateData[0].birth_date : null,
                  birth_city: candidateData[0].birth_city ? candidateData[0].birth_city : null,
                  birth_country_id: candidateData[0].birth_country_id ? candidateData[0].birth_country_id : null,
                  birth_name: null,
                  manager_email: null,
                  calendar_id: null,
                  departement_id: null,
                  emergency_contact_name: null,
                  emergency_contact_phone: null,
                  bank_name: null,
                  bank_iban: null,
                  rib_key: null,
                  medical_exam_date: null,
                  status: 'A',
                  application_id: candidateData[0].candidateKey.application_id,
                  email_address: candidateData[0].candidateKey.email_address,
                };
                this.collaboratorService.addCollaborator(collaborator).subscribe(() => {
                  this.userService.getAllUsers(`?email_address=${changeStatusData.user_info.ResumeKey.email_address}`)
                    .subscribe( (user: IUserModel[]) => {
                    user['results'][0].user_type = 'COLLABORATOR';
                    user['results'][0].application_id = user['results'][0].userKey.application_id;
                    user['results'][0].email_address = user['results'][0].userKey.email_address;
                    this.userService.updateUser(user['results'][0]).subscribe(async () => {
                      await this.getData(0, this.nbtItems.getValue());
                      this.candidateService.deleteCandidate(candidateData[0]._id).subscribe(async (deleteCandidate) => {
                        console.log('candidate deleted', deleteCandidate);
                        this.resumeService.getResumeData(`?resume_code=${changeStatusData.user_info.ResumeKey.resume_code}`)
                          .subscribe((resumeData) => {
                            console.log('resumeData model', resumeData);
                          resumeData[0].user_type = 'COLLABORATOR';
                          resumeData[0].resume_code = resumeData[0].ResumeDataKey.resume_code;
                          resumeData[0].application_id = resumeData[0].ResumeDataKey.application_id;
                          resumeData[0].collaborator_email = resumeData[0].ResumeDataKey.collaborator_email;
                          resumeData[0].company_email = resumeData[0].ResumeDataKey.company_email;
                          this.resumeService.updateResumeData(resumeData[0]).subscribe( (updateResumeData) => {
                            console.log('resume data updated');
                          });
                        });
                      });

                    });
                  });
                });
              });
              });
            }
            this.subscriptionModal.unsubscribe();
    });
    }
  /**************************************************************************
   * @description Change User from Active to Archive
   * data: contains the data of user
   *************************************************************************/
  archiveUser(data) {
    data.map( (dataResume) => {
      dataResume.user_info.resume_code = dataResume.user_info.ResumeKey.resume_code;
      dataResume.user_info.language_id = dataResume.user_info.ResumeKey.language_id;
      dataResume.user_info.company_email = dataResume.user_info.ResumeKey.company_email;
      dataResume.user_info.email_address = dataResume.user_info.ResumeKey.email_address;
      dataResume.user_info.application_id = dataResume.user_info.ResumeKey.application_id;
      dataResume.user_info.status = 'D';
      this.resumeService.updateResume(dataResume.user_info).subscribe( async (res) => {
        await this.getData(0, this.nbtItems.getValue());
      });
    });
    }
  /**************************************************************************
   * @description Send color Object to the resume data table
   *************************************************************************/
  sendColorObject() {
    return  [{
      columnCode: 'resume_user_type',
      condValue: [
        'COLLABORATOR',
        'CANDIDATE',
      ],
      color: [
        'topaz',
        'red',
      ],
    }, {
      columnCode: 'resume_status',
      condValue: [
        'A',
        'D',
      ],
      color: [
        'topaz',
        'red',
      ],
    }];
  }
  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getData(params.offset, params.limit);
  }
}
