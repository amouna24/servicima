import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';

import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import {Subscription} from "rxjs";
import {ModalService} from "@core/services/modal/modal.service";

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
  minDate: Date;
  maxDate: Date;
  showDateError = false;
  certif_diploma_code = '';
  indexUpdate = 0;
  button = 'Add';
  certifDiplomaUpdate: IResumeCertificationDiplomaModel;
  _id = '';
  subscriptionModal: Subscription;
  get getCertifDiploma() {
    return this.certifDiplomaArray;
  }

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
  ) {
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear, currentMonth, currentDay + 25);
    this.getCertifDiplomaInfo();
    this.createForm();
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
                if (responseOne['msg_code'] !== '0004') {
                  console.log('response', responseOne);
                  this.certifDiplomaArray = responseOne;
                  this.certifDiplomaArray.forEach(
                    (func) => {
                      func.certif_diploma_code = func.ResumeCertificationDiplomaKey.certif_diploma_code;
                    }
                  );
                }
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
      diploma: '',
      start_date: '',
      end_date: '',
      certif_diploma_desc: '',
    });
  }

  /**
   * @description Create Technical skill
   */
  createUpdateCertifDiploma(dateStart, dateEnd) {
    if (this.button === 'Add') {
    this.compareDate(dateStart, dateEnd);
    this.certifDiploma = this.sendCertifDiploma.value;
    this.certifDiploma.resume_code = this.resume_code.toString();
    this.certifDiploma.certif_diploma_code = Math.random().toString();
    if (this.sendCertifDiploma.valid && this.showDateError === false) {
      console.log('ProExp input= ', this.certifDiploma);
      this.resumeService.addCertifDiploma(this.certifDiploma).subscribe(data =>{
        console.log('certif =', data);
        this.getCertifDiplomaInfo();
      });
    } else {
      console.log('Form is not valid');
      this.showDateError = false;

    }
    this.arrayCertifDiplomaCount++; } else {
      this.certifDiplomaUpdate = this.sendCertifDiploma.value;
      this.certifDiplomaUpdate.certif_diploma_code = this.certif_diploma_code;
      this.certifDiplomaUpdate.resume_code = this.resume_code;
      this.certifDiplomaUpdate._id = this._id;
      this.resumeService.updateCertifDiploma(this.certifDiplomaUpdate).subscribe(data => console.log('Certif updated =', data));
      this.certifDiplomaArray[this.indexUpdate] = this.certifDiplomaUpdate;
      this.button = 'Add';
    }
    this.sendCertifDiploma.reset();
  }

  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType);
  }

  compareDate(date1, date2) {
    console.log(date1, '-----', date2);
    const dateStart = new Date(date1);
    const dateEnd = new Date(date2);
    if (dateStart.getTime() > dateEnd.getTime()) {
      console.log('illogic date');
      this.showDateError = true;
    }

  }

  // tslint:disable-next-line:max-line-length
  editForm(_id: string, diploma: string, start_date: string, end_date: string, establishment: string, certif_diploma_desc: string, certif_diploma_code: string, pointIndex: number) {
    this.sendCertifDiploma.patchValue({
      diploma,
      start_date,
      end_date,
      establishment,
      certif_diploma_desc,
    });
    this.certif_diploma_code = certif_diploma_code;
    this._id = _id;
    this.indexUpdate = pointIndex;
    this.button = 'Save';
  }

  deleteCertif(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Are you sure ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteCertifDiploma(_id).subscribe(data => console.log('Deleted'));
            this.certifDiplomaArray.forEach((value, index) => {
              if (index === pointIndex) { this.certifDiplomaArray.splice(index, 1); }
            });
            this.button = 'Add';
            this.subscriptionModal.unsubscribe();

          }
        }
      );

  }
  testRequired() {
    return (this.sendCertifDiploma.invalid) ;
  }
}
