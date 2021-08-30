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
  clientEmailAddress: string;
  constructor(
    private userService: UserService,
    private resumeService: ResumeService,
    private router: Router,
    private modalServices: ModalService,
    private collaboratorService: CollaboratorService,
    private candidateService: CandidateService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.clientEmailAddress = 'khmayesbounguicha@gmail.com';
    this.getData().then((data) => {
      this.tableData.next(data);
    });
  }
  getData() {
    const blocData = [];
    return new Promise((resolve) => {
      this.userService.connectedUser$.subscribe((userInfo) => {
        this.userService.getAllUsers(`?company_email=${userInfo['company'][0].companyKey.email_address}`).subscribe(async (res) => {
          console.log('res', res);
          res['results'].forEach( (candidate, index) => {
             this.resumeService.getResume(`?email_address=${candidate.userKey.email_address}&company_email=${candidate.company_email}`)
              .subscribe((resume) => {
                if (resume['msg_code'] !== '0004') {
                  blocData.push({
                    resume_name: candidate.first_name + ' ' + candidate.last_name,
                    resume_years_exp: resume[0].years_of_experience,
                    resume_position: resume[0].actual_job,
                    resume_status: candidate.user_type,
                    resume_email: candidate.userKey.email_address === 'khmayesbounguicha@gmail.com' ?
                      { value: candidate.userKey.email_address, color: '#00FF00'} :
                      candidate.userKey.email_address === 'ndanydanyel536s@hangsuka.com' ?
                        { value: candidate.userKey.email_address, color: '#FFFF00'} :
                          candidate.userKey.email_address,
                    resume_user_type: candidate.user_type,
                    resume_filename_docx: resume[0].resume_filename_docx,
                    resume_filename_pdf: resume[0].resume_filename_pdf,
                    user_info: resume[0],
                    first_name: candidate.first_name,
                    last_name: candidate.last_name,
                  });
                }
              });
            if (index + 1 === res['results'].length) {
              resolve(blocData);
            }
          });

        });
      });
    });
  }

  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'):
        this.changeCandidateToCollaborator(rowAction.data);
        break;
      case ('update'):
        this.updateResume(rowAction.data);
        break;
      case('delete'):
        this.sendMail(rowAction.data);
    }
  }

  exportPdf(data) {
    if (data.resume_filename_pdf !== undefined && data.resume_filename_pdf !== null) {
      window.open(environment.uploadFileApiUrl + '/show/' + data.resume_filename_pdf, '_blank');
    } else {
      const confirmation = {
        code: 'info',
        title: 'Export Resume',
        description: `You cant export this resume because it doesnt exist`,
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
  }

  private updateResume(data) {
    console.log('general info =', data.user_info);
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
        }
      });
  }

  private downloadDocx(data) {
    if (data.resume_filename_docx !== undefined && data.resume_filename_docx !== null) {
      window.location.href = environment.uploadFileApiUrl + '/show/' + data.resume_filename_docx;
    } else {
      const confirmation = {
        code: 'info',
        title: 'Export Resume',
        description: `You cant export this resume because it doesnt exist`,
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
  }

  private sendMail(data) {
    const confirmation = {
      code: 'edit',
      title: 'Send Email',
      description: `Are you sure you want to send mail to ${this.clientEmailAddress}`,
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '550px', '350px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService
              .sendMail('5eac544ad4cb666637fe1354',
                data.user_info.ResumeKey.application_id,
                '5ee69e061d291480d44f4cf2',
                this.clientEmailAddress,
                'WIDIGITAL',
                data.user_info.actual_job,
                `${environment.uploadFileApiUrl}/show/${data.resume_filename_docx}`
              ).subscribe((dataB) => {
              console.log(dataB);
            });
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  changeCandidateToCollaborator(data) {
    const confirmation = {
      code: 'edit',
      title: 'Change user type',
      description: `Are you sure you want to change the candidate ${data.resume_name} to collaborator`,
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '550px', '350px')
      .subscribe(
        (res) => {
          if (res === true) {
            console.log('true');
            this.candidateService.getCandidate(`?email_address=${data.user_info.ResumeKey.email_address}`).subscribe((candidateData) => {
              console.log('hello get candidate', candidateData);
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
              console.log('collaborator =', collaborator);
              this.collaboratorService.addCollaborator(collaborator).subscribe(() => {
                this.userService.getAllUsers(`?email_address=${data.user_info.ResumeKey.email_address}`).subscribe( (user: IUserModel[]) => {
                  console.log(user);
                  user['results'][0].user_type = 'COLLABORATOR';
                  user['results'][0].application_id = user['results'][0].userKey.application_id;
                  user['results'][0].email_address = user['results'][0].userKey.email_address;

                  this.userService.updateUser(user['results'][0]).subscribe(() => {
                    console.log('user updated');
                    this.candidateService.deleteCandidate(candidateData[0]._id).subscribe((deleteCandidate) => {
                      console.log('candidate deleted', deleteCandidate);
                      this.getData().then((dataUsers) => {
                        this.tableData.next(dataUsers);
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
}
