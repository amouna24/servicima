import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResumeCertificationDiplomaModel } from '@shared/models/resumeCertificationDiploma.model';

import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { Router, RoutesRecognized } from '@angular/router';
import { blueToGrey, downLine, GreyToBlue, lineIndexation, showBloc, showProExp } from '@shared/animations/animations';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'wid-resume-certif-diploma',
  templateUrl: './resume-certif-diploma.component.html',
  styleUrls: ['./resume-certif-diploma.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    showBloc,
    showProExp,
    lineIndexation,
  ]
})
export class ResumeCertifDiplomaComponent implements OnInit {
  sendCertifDiploma: FormGroup;
  arrayCertifDiplomaCount = 0;
  certifDiploma: IResumeCertificationDiplomaModel;
  certifDiplomaArray: IResumeCertificationDiplomaModel[];
  resumeCode: string;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  showDateError: boolean;
  certifDiplomaCode: string;
  indexUpdate: number;
  button: string;
  certifDiplomaUpdate: IResumeCertificationDiplomaModel;
  id: string;
  subscriptionModal: Subscription;
  showNumberError: boolean;
  getIndex =  this.getPreviousUrl();

  /**********************************************************************
   * @description Resume Certifications and diplomas constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
    private router: Router
  ) {
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit(): Promise<void> {
    this.showDateError = false;
    this.showNumberError = false;
    this.button = 'Add';
    this.certifDiplomaArray = [];
    this.initDate();
    this.getCertifDiplomaInfo();
    this.createForm();

  }

  /**************************************************************************
   * @description Get all Certification and diploma Data from Resume Service
   *************************************************************************/
  getCertifDiplomaInfo() {
    this.resumeService.getResume(
      `?email_address=${this.userService.connectedUser$
        .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
        .getValue().user[0]['company_email']}`).subscribe((response) => {
        if (response['msg_code'] !== '0004') {
          this.resumeCode = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getCertifDiploma(
            `?resume_code=${this.resumeCode}`)
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
        } else {
          this.router.navigate(['/candidate/resume/']);
        }
      },
      (error) => {
        if (error.error.msg_code === '0004') {
        }
      },
    );
  }

  /**************************************************************************
   * @description Initialization of Certification and diploma Form
   *************************************************************************/
  createForm() {
    this.sendCertifDiploma = this.fb.group({
      establishment: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      diploma: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      certif_diploma_desc: '',
    });
  }

  /**************************************************************************
   * @description Create or Update Certification/Diploma
   *************************************************************************/
  createUpdateCertifDiploma() {
    if (this.button === 'Add') {
      this.certifDiploma = this.sendCertifDiploma.value;
      this.certifDiploma.resume_code = this.resumeCode.toString();
      this.certifDiploma.certif_diploma_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-CERTIF`;
      if (this.sendCertifDiploma.valid && this.showDateError === false) {
        this.resumeService.addCertifDiploma(this.certifDiploma).subscribe(data => {
          this.resumeService.getCertifDiploma(
            `?certif_diploma_code=${this.certifDiploma.certif_diploma_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.certifDiplomaArray.push(responseOne[0]);
                }});        });
      } else {
        this.showDateError = false;
        this.showNumberError = false;
      }
      this.arrayCertifDiplomaCount++;
    } else {
      this.certifDiplomaUpdate = this.sendCertifDiploma.value;
      this.certifDiplomaUpdate.certif_diploma_code = this.certifDiplomaCode;
      this.certifDiplomaUpdate.resume_code = this.resumeCode;
      this.certifDiplomaUpdate._id = this.id;
      if (this.sendCertifDiploma.valid) {
        this.resumeService.updateCertifDiploma(this.certifDiplomaUpdate).subscribe((data) => {
          this.certifDiplomaArray.splice(this.indexUpdate, 0, data);
          console.log('certif updated', data);
        });
        this.button = 'Add';
      }
    }
    this.sendCertifDiploma.reset();
    this.showNumberError = false;
  }

  /**************************************************************************
   * @description get data from a selected certification/Diploma and set it in the current form
   * @param certifDiploma Certifications and diploma Model
   * @param pointIndex the index of the current certif and diploma
   *************************************************************************/
  editForm(certifDiploma: IResumeCertificationDiplomaModel, pointIndex: number) {
    this.sendCertifDiploma.patchValue({
      diploma: certifDiploma.diploma,
      start_date: certifDiploma.start_date,
      end_date: certifDiploma.end_date,
      establishment: certifDiploma.establishment,
      certif_diploma_desc: certifDiploma.certif_diploma_desc,
    });
    this.certifDiplomaCode = certifDiploma.ResumeCertificationDiplomaKey.certif_diploma_code;
    this.id = certifDiploma._id;
    this.indexUpdate = pointIndex;
    this.certifDiplomaArray.splice(pointIndex, 1);
    this.button = 'Save';
  }

  /**************************************************************************
   * @description Delete the selected certif/Diploma
   * @param id id of the certif and diploma model that is going to be deleted
   * @param pointIndex index of the deleted certif and diploma
   *************************************************************************/
  deleteCertif(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-diploma',
      description: 'resume-u-sure'
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteCertifDiploma(id).subscribe(cert => console.log('deleted'));
            this.certifDiplomaArray.forEach((value, index) => {
              if (index === pointIndex) {
                this.certifDiplomaArray.splice(index, 1);
              }
            });
            this.button = 'Add';

          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }

  /**************************************************************************
   * @description change the minimum of the end Date DatePicker
   * @param date: the minimum of end date in the datePicker
   *************************************************************************/
  onChangeStartDate(date: string) {
    this.minEndDate = new Date(date);
  }

  /**************************************************************************
   * @description change the maximum of the Start Date DatePicker
   * @param date the maximum of the start Date DatePicker
   *************************************************************************/
  onChangeEndDate(date: string) {
    this.maxStartDate = new Date(date);
  }

  /**************************************************************************
   * @description Initialize Max and Min date in the DatePicker
   *************************************************************************/
  initDate() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minEndDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDay);
    this.minStartDate = new Date(currentYear - 20, 0, 1);
    this.maxStartDate = new Date(currentYear, currentMonth, currentDay);
  }
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
      getPreviousUrl() {
        new Promise((resolve) => {
         this.router.events
           .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
           .subscribe((events: RoutesRecognized[]) => {
             resolve(events[0].urlAfterRedirects);
           });
       }).then((res) => {
         return (res);
       });
     }

  getIndexF(res): string {
    console.log('res getIndex=', res);
     switch (res) {
       case '/candidate/resume':
         return `translateY(${(2 - 1) * -20}px)`;
       case '/candidate/resume/certifications':
         return `translateY(${(2 - 3) * -20}px)`;
       case '/candidate/resume/technicalSkills':
         return `translateY(${(2 - 4) * -20}px)`;
       case '/candidate/resume/functionalSkills':
         return `translateY(${(2 - 5) * -20}px)`;
       case '/candidate/resume/intervention':
         return `translateY(${(2 - 6) * -20}px)`;
       case '/candidate/resume/professionalExperience':
         return `translateY(${(2 - 7) * -20}px)`;
       case '/candidate/resume/dynamicSection':
         return `translateY(${(2 - 8) * -20}px)`;
       case '/candidate/resume/language':
         return `translateY(${(2 - 9) * -20}px)`;
       default: {
         return'translateY(-20px)';
       }
     }
   }
}
