import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';

import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';

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
  resume_code = '';
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  showDateError = false;
  certif_diploma_code = '';
  indexUpdate = 0;
  button = 'Add';
  certifDiplomaUpdate: IResumeCertificationDiplomaModel;
  _id = '';
  subscriptionModal: Subscription;
   showNumberError = false;
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
  ) {
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minEndDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDay + 23 );
    this.minStartDate = new Date(currentYear - 20, 0, 1);
    this.maxStartDate = new Date(currentYear, currentMonth, currentDay + 23);
    this.getCertifDiplomaInfo();
    this.createForm();
  }
  /**************************************************************************
   * @description Get all Certification and diploma Data from Resume Service
   *************************************************************************/
  getCertifDiplomaInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getCertifDiploma(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
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
   * @description Initialization of Certification and diploma Form
   */
  createForm() {
    this.sendCertifDiploma = this.fb.group({
      establishment: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      diploma: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      start_date: ['',  Validators.required],
      end_date: ['', Validators.required],
      certif_diploma_desc: '',
    });
  }

  /**
   * @description Create or Update Certification/Diploma
   */
  createUpdateCertifDiploma(dateStart, dateEnd) {
    if (this.button === 'Add') {
    this.certifDiploma = this.sendCertifDiploma.value;
    this.certifDiploma.resume_code = this.resume_code.toString();
    this.certifDiploma.certif_diploma_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-CERTIF`;
      if (this.sendCertifDiploma.valid && this.showDateError === false ) {
      this.resumeService.addCertifDiploma(this.certifDiploma).subscribe(data => {
        this.getCertifDiplomaInfo();
      });
    } else {
      this.showDateError = false;
      this.showNumberError = false;
    }
    this.arrayCertifDiplomaCount++; } else {
      this.certifDiplomaUpdate = this.sendCertifDiploma.value;
      this.certifDiplomaUpdate.certif_diploma_code = this.certif_diploma_code;
      this.certifDiplomaUpdate.resume_code = this.resume_code;
      this.certifDiplomaUpdate._id = this._id;
      if (this.sendCertifDiploma.valid) {
        this.resumeService.updateCertifDiploma(this.certifDiplomaUpdate);
      this.certifDiplomaArray[this.indexUpdate] = this.certifDiplomaUpdate;
      this.button = 'Add'; }
    }
    this.sendCertifDiploma.reset();
    this.showNumberError = false;
  }
  /**************************************************************************
   * @description Set data of a selected certification/Diploma and set it in the current form
   *************************************************************************/
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
  /**************************************************************************
   * @description Delete the selected certif/Diploma
   *************************************************************************/
  deleteCertif(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Delete This Certification/Diploma ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteCertifDiploma(_id).subscribe(cert => console.log('deleted'));
            this.certifDiplomaArray.forEach((value, index) => {
              if (index === pointIndex) { this.certifDiplomaArray.splice(index, 1); }
            });
            this.button = 'Add';

          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  /**************************************************************************
   * @description change the minimumn of the end Date DatePicker
   *************************************************************************/
  onChangeStartDate(date: string) {
    console.log(date);
    this.minEndDate = new Date(date);
    console.log('min date after change', this.minEndDate);
  }
  /**************************************************************************
   * @description change the maximum of the Start Date DatePicker
   *************************************************************************/
  onChangeEndDate(date: string) {
    console.log(date);
    this.maxStartDate = new Date(date);
    console.log('max date after change', this.maxStartDate);
  }
}
