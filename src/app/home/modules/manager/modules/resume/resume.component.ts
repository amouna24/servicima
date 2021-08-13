import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ResumeService } from '@core/services/resume/resume.service';
import { Router } from '@angular/router';

import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'wid-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  blocData = [];
  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  constructor(
    private userService: UserService,
    private resumeService: ResumeService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.getData().then((data) => {
      this.tableData.next(data);
      console.log('table data', this.tableData);
    });
  }

  getData() {
    return new Promise((resolve) => {
      this.userService.connectedUser$.subscribe((userInfo) => {
        console.log(userInfo);
        this.userService.getUsers(userInfo['company'][0].companyKey.email_address, 'CANDIDATE').subscribe((res) => {
          res['results'].forEach((candidate) => {
            console.log('mail address', candidate.userKey.email_address, 'company email', candidate.company_email,
              'name=', candidate.first_name + ' ' + candidate.last_name);
            this.resumeService.getResume(`?email_address=${candidate.userKey.email_address}&company_email=${candidate.company_email}`)
              .subscribe((resume) => {
                if (resume['msg_code'] !== '0004') {
                  this.blocData.push({
                    resume_name: candidate.first_name + ' ' + candidate.last_name,
                    resume_years_exp: resume[0].years_of_experience,
                    resume_position: resume[0].actual_job,
                    resume_status: 'Candidate',
                    resume_email: candidate.userKey.email_address,
                    resume_user_type: candidate.user_type,
                    resume_filename_docx: resume[0].resume_filename_docx,
                    resume_filename_pdf: resume[0].resume_filename_pdf,
                    user_info: resume[0],
                  });
                  console.log('res', resume);
                }
              });
          });
          console.log(this.blocData);
          resolve(this.blocData);
        });
      });
    });
  }

  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'):
        this.showBloc(rowAction.data);
        break;
      case ('update'):
        this.updateBloc(rowAction.data);
        break;
      case('delete'):
        this.deleteBloc(rowAction.data);
    }
  }
  showBloc(data) {
      window.open(environment.uploadFileApiUrl + '/show/' + data.resume_filename_pdf,  '_blank');
    }
  private updateBloc(data) {
    console.log('general info =', data.user_info);
    data.user_info.resume_code = data.user_info.ResumeKey.resume_code;
    data.user_info.language_id = data.user_info.ResumeKey.language_id;
    data.user_info.company_email = data.user_info.ResumeKey.company_email;
    data.user_info.email_address = data.user_info.ResumeKey.email_address;
    data.user_info.application_id = data.user_info.ResumeKey.application_id;
    this.router.navigate(['/candidate/resume/'],
      {
        state: {
          generalInformation: data.user_info
        }
      });
  }

  private deleteBloc(data) {
    window.location.href = environment.uploadFileApiUrl + '/show/' + data.resume_filename_docx;
  }
}
