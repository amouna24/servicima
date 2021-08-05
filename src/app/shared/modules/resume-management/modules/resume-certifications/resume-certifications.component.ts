import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResumeCertificationModel } from '@shared/models/resumeCertification.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { blueToGrey, GreyToBlue, downLine, showBloc } from '@shared/animations/animations';
@Component({
  selector: 'wid-resume-certifications',
  templateUrl: './resume-certifications.component.html',
  styleUrls: ['./resume-certifications.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    showBloc
  ]
})
export class ResumeCertificationsComponent implements OnInit {
certifForm: FormGroup;
certification: IResumeCertificationModel;
certificationUpdate: IResumeCertificationModel;
resumeCode: string;
certificationArray: IResumeCertificationModel[];
certificationArrayCount = 0;
showExpireDatePicker: boolean;
indexUpdate = 0;
expire: boolean;
subscriptionModal: Subscription;
id: string;
certificationCode: string;
button: string;
  /**********************************************************************
   * @description Resume Certification constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
) { }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.expire = true;
    this.button = 'Add';
    this.certificationArray = [];
    this.showExpireDatePicker = true;
    this.getCertificationInfo();
    this.createCertifForm();
  }
  /**************************************************************************
   * @description Initialize the Certification form
   *************************************************************************/
  createCertifForm() {
    this.certifForm = this.fb.group( {
      name: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      expire: [false],
      date: ['', [Validators.required]],
      expiring_date: '',
      certif_ref: '',
      certif_url: '',
    });
  }
  /**************************************************************************
   * @description Create or Update Certification
   *************************************************************************/
  createCertification() {
    if (this.button === 'Add') {
      this.certification = this.certifForm.value;
      this.certification.resume_code = this.resumeCode;
      this.certification.certification_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-CERTIF`;
      this.resumeService.addCertification(this.certification).subscribe(data => {
        this.createCertifForm();
        this.certificationArrayCount++;
        this.certifForm.controls.expiring_date.enable();
        this.expire = true;
        this.resumeService.getCertification(
          `?certification_code=${this.certification.certification_code}`)
          .subscribe(
            (responseOne) => {
              if (responseOne['msg_code'] !== '0004') {
                this.certificationArray.push(responseOne[0]);
              }});      });
    } else if (this.button === 'Save') {
      this.certificationUpdate = this.certifForm.value;
      this.certificationUpdate.certification_code = this.certificationCode;
      this.certificationUpdate.resume_code = this.resumeCode;
      this.certificationUpdate._id = this.id;
        this.resumeService.updateCertification(this.certificationUpdate).subscribe(data => {
          this.createCertifForm();
          this.certificationArray.splice(this.indexUpdate, 0, data);
        });
        this.button = 'Add';
    }
  }
  /**************************************************************************
   * @description Get Certification data from Resume Service
   *************************************************************************/
  getCertificationInfo() {
      this.resumeService.getResume(
        `?email_address=${this.userService.connectedUser$
          .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
          .getValue().user[0]['company_email']}`).subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.resumeCode = response[0].ResumeKey.resume_code.toString();
            this.resumeService.getCertification(
              `?resume_code=${this.resumeCode}`)
              .subscribe(
                (responseOne) => {
                  if (responseOne['msg_code'] !== '0004') {
                    this.certificationArray = responseOne;
                    this.certificationArrayCount = responseOne.length;
                    this.certificationArray.forEach(
                      (certif) => {
                        certif.certification_code = certif.ResumeCertificationKey.certification_code;
                      }
                    );
                  }
                },
                (error) => {
                  if (error.error.msg_code === '0004') {
                  }
                },
              );
          }
        },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );
    }
  /*******************************************************************
   * @description Action on checkbox of the expired certificate
   * @param event event of the checkbox
   *******************************************************************/
  verifyExpired(event: MatCheckboxChange) {
    if (event.checked) {
      this.certifForm.controls.expiring_date.disable();
      this.expire = false;
    } else {
      this.certifForm.controls.expiring_date.enable();
      this.expire = true;
    }
  }
  /**************************************************************************
   * @description Delete Selected Certification
   * @param id the id of the deleted Certification
   * @param pointIndex the index of the deleted Certification
   *************************************************************************/
  deleteCertification(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Delete Certification',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteCertification(id).subscribe(data => console.log('Deleted'));
            this.certificationArray.forEach((value, index) => {
              if (index === pointIndex) {
                this.certificationArray.splice(index, 1);
              }
            });
            this.button = 'Add';
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  /**************************************************************************
   * @description get data from a selected Certification and set it in the current form
   * @param certification the certification model
   * @param index the index of the selected certification
   *************************************************************************/
  editForm(certification: IResumeCertificationModel, index: number) {
    this.certifForm.patchValue({
      name: certification.name,
      organization: certification.organization,
      expire: certification.expire,
      date: certification.date,
      expiring_date: certification.expiring_date,
      certif_ref: certification.certif_ref,
      certif_url: certification.certif_url,
    });
    this.id = certification._id;
    this.certificationCode = certification.ResumeCertificationKey.certification_code;
    this.indexUpdate = index;
    this.certificationArray.splice( index, 1);
    if (certification.expiring_date !== undefined) {
      this.certifForm.controls.expiring_date.enable();
      this.certifForm.controls.expire.setValue(false);
    } else {
      this.certifForm.controls.expiring_date.disable();
      this.certifForm.controls.expire.setValue(true);
    }
    this.button = 'Save';
  }
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
}
