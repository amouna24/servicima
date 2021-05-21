import { Component, Input, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';
import { IResumeProjectDetailsModel } from '@shared/models/resumeProjectDetails.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { Router } from '@angular/router';
import { IViewParam } from '@shared/models/view.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
@Component({
  selector: 'wid-project-section',
  templateUrl: './project-section.component.html',
  styleUrls: ['./project-section.component.scss']
})
export class ProjectSectionComponent implements OnInit {
  sendProSectionDetails: FormGroup;
  sendProDetails: FormGroup;
  arrayProSectionDetailsCount = 0;
  arrayProDetailsCount = 0;
  proDetailsArray: IResumeProjectDetailsModel[] = [];
  proSectionArray: IResumeProjectDetailsSectionModel[] = [];
  ProDetails: IResumeProjectDetailsModel;
  ProSectionDetails: IResumeProjectDetailsSectionModel;
  project_details_code = `` ;
  showDesc = true;
  showSec = false;
  select = 'PARAGRAPH';
  list = '';
  desc = '';
  secList: IViewParam[];
  refData: { } = { };
  emailAddress: string;
  proDetailUpdate: IResumeProjectDetailsModel;
  subscriptionModal: Subscription;
  selectValue = 'PARAGRAPH';

  @Input() project_code = '';
  _id = '';
  indexUpdate = 0;
  button = 'Add';

  get getProjectSection() {
    return this.proDetailsArray ;
  }
  get inputFields() {
    return this.proSectionArray ;
  }
  constructor(
    private refdataService: RefdataService,
    private utilService: UtilsService,
    private userService: UserService,
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private router: Router,
    private modalServices: ModalService,

  ) { }

 async ngOnInit() {
    this.getConnectedUser();
    this.getProjectDetailsInfo();
    this.createFormProDetails();
    this.createFormSectionDetails();
   await this.getSectionRefData();
    this.project_details_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-R-PE-P-D`;
    this.sendProDetails.get('select').valueChanges.subscribe(selectedValue => {
     this.select = selectedValue;
      console.log('selected value = ', selectedValue);
    });
  }
  async getSectionRefData() {
    const data = await this.getRefdata();
    this.secList = data['SECTION_TYPE'];
    console.log(this.secList);
  }
  async getRefdata() {
    const list = ['SECTION_TYPE'];
    this.refData =  await this.refdataService
      .getRefData( this.utilService.getCompanyId(this.emailAddress, this.userService.applicationId) , this.userService.applicationId,
        list, false);
    return this.refData;
  }
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }
  createFormProDetails() {
    this.sendProDetails = this.fb.group({
      project_detail_title: ['', [Validators.pattern('(?!^\\d+$)^.+$')]],
      project_detail_desc: ['', [Validators.pattern('(?!^\\d+$)^.+$')]],
        select: 'PARAGRAPH',
      });
  }
  getProjectDetailsInfo() {
    this.resumeService.getProjectDetails(
      // tslint:disable-next-line:max-line-length
      `?project_code=${this.project_code}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            console.log('response=', response);
          this.proDetailsArray = response;
       } },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  /**
   * @description Create Form
   */
  createFormSectionDetails() {
    this.sendProSectionDetails = this.fb.group({
        project_details_section_desc: ['', [Validators.pattern('(?!^\\d+$)^.+$')]],
      });
  }
  /**
   * @description Create Custom section
   */
  createProSectionDetails() {
    this.ProSectionDetails = this.sendProSectionDetails.value;
    this.ProSectionDetails.project_details_section_code = `WID-${Math.
    floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P-D-S`;
    this.ProSectionDetails.project_details_code = this.project_details_code;
    console.log(this.ProSectionDetails);
    if (this.sendProSectionDetails.valid) {
      /*this.resumeService.
      addProjectDetailsSection(this.ProSectionDetails).
      subscribe(dataSection => console.log('Section details =', dataSection));*/
      this.proSectionArray.push(this.ProSectionDetails);

    } else { console.log('Form is not valid');
    }
    this.sendProSectionDetails.reset();
    this.arrayProSectionDetailsCount++;

  }
  createProDetails() {
    if (this.button === 'Add') {
    this.ProDetails = this.sendProDetails.value;
    this.ProDetails.project_details_code = this.project_details_code;
    this.ProDetails.project_code = this.project_code;
    if (this.sendProDetails.valid) {
      console.log('project details=', this.ProDetails);
      this.resumeService.addProjectDetails(this.ProDetails).subscribe(dataProDeta => this.getProjectDetailsInfo());
      console.log(this.ProSectionDetails);
      if (this.ProSectionDetails !== undefined) {
      this.proSectionArray.forEach((sec) => {
        this.resumeService.
        addProjectDetailsSection(sec).
        subscribe(dataSection => console.log('Section details =', dataSection));
        }); }
      this.project_details_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P-D`;
    } else { console.log('Form is not valid');
    } } else if (this.button === 'Save') {
      this.proDetailUpdate = this.sendProDetails.value;
      this.proDetailUpdate.project_code = this.project_code;
      this.proDetailUpdate.project_details_code = this.project_details_code;
      this.proDetailUpdate._id = this._id;
      console.log('pro Detail Update =', this.proDetailUpdate);
      this.resumeService.updateProjectDetails(this.proDetailUpdate).subscribe(data => this.getProjectDetailsInfo());
      this.proDetailsArray[this.indexUpdate] = this.proDetailUpdate;
      this.button = 'Add';
    }
    this.arrayProDetailsCount++;
    this.showDesc = true;
    this.showSec = false;
    this.createFormProDetails();
    this.sendProDetails.get('select').valueChanges.subscribe(selectedValue => {
      this.select = selectedValue;
      console.log('selected value = ', selectedValue);
    });
    this.project_details_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-R-PE-P-D`;
    this.proSectionArray = [];
  }
  onSelect() {
    console.log(this.select);
    if (this.select === 'PARAGRAPH') {
      this.showDesc = true;
      this.showSec = false;
    } else if (this.select === 'LIST') {
      this.showDesc = !this.showDesc;
      this.showSec = !this.showSec;
    }

}
// tslint:disable-next-line:max-line-length
  editForm(project_code: string, project_detail_title: any, project_detail_desc: any, pointIndex: number, _id: string, project_details_code: string) {
    this.sendProDetails.patchValue({
      project_detail_title,
      project_detail_desc,
      select: this.select
    });
    if (project_detail_desc === null || project_detail_desc === '') {
      this.resumeService.getProjectDetailsSection(
        // tslint:disable-next-line:max-line-length
        `?project_details_code=${project_details_code}`)
        .subscribe(
          (response) => {
            if (response['msg_code'] !== '0004') {
              console.log('response=', response);
              this.proSectionArray = response;
            } },
          (error) => {
            if (error.error.msg_code === '0004') {
            }
          },
        );
      this.showDesc = false;
      this.showSec = true;
      this.select = 'LIST';
    } else {
      this.showDesc = true;
      this.showSec = false;
      this.select = 'PARAGRAPH';
    }
    this.project_code = project_code;
    this.project_details_code = project_details_code;
    this._id = _id.toString();
  this.indexUpdate = pointIndex;
  this.button = 'Save';
  }
  /**************************************************************************
   * @description Delete the selected certif/Diploma
   *************************************************************************/
  deleteProject(_id: string, pointIndex: number, project_details_code) {
    const confirmation = {
      code: 'delete',
      title: 'Are you sure ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProjectDetails(_id).subscribe((pro) => {
                console.log('deleted');
                this.resumeService.getProjectDetailsSection(`?project_code=${project_details_code}`).subscribe((resp) => {
                  if (resp.length !== undefined) {
                    console.log('resp length', resp.length);
                  resp.forEach(sec => {
                    this.resumeService.deleteProjectDetailsSection(sec._id).subscribe(secc => {
                      console.log('section details deleted');
                    });
                  }); }
                });
              this.proDetailsArray.forEach((value, index) => {
                if (index === pointIndex) {
                  this.proDetailsArray.splice(index, 1);
                }
              });
                this.button = 'Add';
              this.showDesc = true;
              this.showSec = false;
              this.createFormProDetails();
              this.sendProDetails.get('select').valueChanges.subscribe(selectedValue => {
                this.select = selectedValue;
                console.log('selected value = ', selectedValue);
              });
              this.proSectionArray = [];
              }
            );
          }
          this.subscriptionModal.unsubscribe();

        }); }
  }
