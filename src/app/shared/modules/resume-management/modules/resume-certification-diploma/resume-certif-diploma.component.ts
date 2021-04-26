import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';

import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-resume-certif-diploma',
  templateUrl: './resume-certif-diploma.component.html',
  styleUrls: ['./resume-certif-diploma.component.scss']
})
export class ResumeCertifDiplomaComponent implements OnInit {
  sendCertifDiploma: FormGroup;
  arrayCertifDiplomaCount = 0;
  certifDiploma: IResumeCertificationDiplomaModel;
  certifDiplomaArray: IResumeCertificationDiplomaModel[] = [];
  resume_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-CERTIF`;
  get getCertifDiploma() {
    return this.certifDiplomaArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCertifDiplomaInfo();
  }
  getCertifDiplomaInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          console.log('resume code 1 =', this.resume_code);
          this.resumeService.getCertifDiploma(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                console.log('response', responseOne);
                this.certifDiplomaArray = responseOne;
              },
              (error) => {
                if (error.error.msg_code === '0004') {
                }
              },
            );
        },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }

  /**
   * @description Create Form
   */
  createForm() {
    this.sendCertifDiploma = this.fb.group({
      establishment: '',
      diploma : '',
      start_date: '',
      end_date: '',
      certif_diploma_desc: '',
    });
  }
  /**
   * @description Create Technical skill
   */
  createCertifDiploma() {
    this.certifDiploma = this.sendCertifDiploma.value;
    this.certifDiploma.resume_code = this.resume_code.toString();
    this.certifDiploma.certif_diploma_code = Math.random().toString();
    if (this.sendCertifDiploma.valid) {
      console.log('ProExp input= ', this.certifDiploma);
      this.resumeService.addCertifDiploma(this.certifDiploma).subscribe(data => console.log('Certification and diploma =', data));
      this.certifDiplomaArray.push(this.certifDiploma);
    } else { console.log('Form is not valid');
    }
    this.arrayCertifDiplomaCount++;
    this.sendCertifDiploma.reset();
  }
}
