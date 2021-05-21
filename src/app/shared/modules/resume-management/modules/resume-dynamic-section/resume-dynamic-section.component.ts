import { Component, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { MatButton } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'wid-resume-dynamic-section',
  templateUrl: './resume-dynamic-section.component.html',
  styleUrls: ['./resume-dynamic-section.component.scss']
})
export class ResumeDynamicSectionComponent implements OnInit {
  private showNumberError = false;
  get getSection() {
    return this.SectionArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
               ) { }
  sendSection: FormGroup;
  arraySectionCount = 0;
  Section: IResumeSectionModel;
  showSection = false;
  SectionArray: IResumeSectionModel[] = [];
  resume_code = '';
  button = 'Add';
  section_code = '';
  indexUpdate = 0;
  sectionUpdate: IResumeSectionModel;
  _id = '';
  subscriptionModal: Subscription;
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getDynamicSectionInfo();
    this.createForm();
    console.log('length=', this.SectionArray.length);
    }
  /**************************************************************************
   * @description Function that change the index between selected Section using cdkDropListGroup
   *************************************************************************/
  drop(event: CdkDragDrop<IResumeSectionModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  /**************************************************************************
   * @description Get Dynamic section Data from Resume Service
   *************************************************************************/
  getDynamicSectionInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          console.log('resume code 1 =', this.resume_code);
          this.resumeService.getCustomSection(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  console.log('response', responseOne);
                  this.SectionArray = responseOne;
                  this.SectionArray.forEach(
                    (sec) => {
                      sec.section_code = sec.ResumeSectionKey.section_code;
                    }
                  );
                  if (this.SectionArray.length !== 0) {
                    console.log('section array on init= ', this.SectionArray);
                    this.showSection = true;
                  }
                } },
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
    console.log('section array =', this.SectionArray);

  }
  /**************************************************************************
   * @description Show The Form of Custom Section
   *************************************************************************/
  showCustomSection() {
    this.showSection = !this.showSection;
  }
  /**
   * @description Initialization of Custom Section Form
   */
  createForm() {
    this.sendSection = this.fb.group({
      section_title: ['', [Validators.pattern('(?!^\\d+$)^.+$')]],
      section_desc: ['', [Validators.pattern('(?!^\\d+$)^.+$')]],
    });
  }
  /**************************************************************************
   * @description Create or Update a Custom Section
   *************************************************************************/
  createUpdateSection() {
    if (this.button === 'Add') {
    this.Section = this.sendSection.value;
    this.Section.resume_code = this.resume_code;
    this.Section.section_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-SEC`;
    this.Section.index = this.arraySectionCount.toString();
    if (this.sendSection.valid) {
      this.resumeService.addCustomSection(this.Section).subscribe(data => {
        console.log('Technical skill =', data);
        this.getDynamicSectionInfo();
      });
    } else { console.log('Form is not valid');
    }
    this.arraySectionCount++; } else {
      this.sectionUpdate = this.sendSection.value;
      this.sectionUpdate.section_code = this.section_code;
      this.sectionUpdate.index = this.indexUpdate.toString();
      this.sectionUpdate.resume_code = this.resume_code;
      this.sectionUpdate._id = this._id;
      this.testNumber(this.sectionUpdate.section_title);
      this.testNumber(this.sectionUpdate.section_desc);
      if  (this.sendSection.valid && !this.showNumberError) {
      this.resumeService.updateCustomSection(this.sectionUpdate).subscribe(data => console.log('custom section updated =', data));
      this.SectionArray[this.indexUpdate] = this.sectionUpdate;
        this.button = 'Add'; }
    }
    this.sendSection.reset();
    this.showNumberError = false;
  }
  /**************************************************************************
   * @description Test the Controls of the Form with a validation type
   *************************************************************************/
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }
  /**************************************************************************
   * @description Set data of a selected Custom section and set it in the current form
   *************************************************************************/
  editForm(_id: string, section_title: string, section_desc: string, section_code: string, pointIndex: number) {
      this.sendSection.patchValue({
        section_title,
        section_desc,
      });
      this._id = _id;
      this.section_code = section_code;
      this.indexUpdate = pointIndex;
      this.button = 'Save';
      /*
      */
    }
  /**************************************************************************
   * @description Delete the selected Custom section
   *************************************************************************/
  deleteSection(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Are you sure ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteCustomSection(_id).subscribe(data => console.log('Deleted'));
            this.SectionArray.forEach((value, index) => {
              if (index === pointIndex) { this.SectionArray.splice(index, 1); }
            });
            this.button = 'Add';
            this.subscriptionModal.unsubscribe();
          }
        }
      );
  }
  /**************************************************************************
   * @description test if a control has numbers only
   *************************************************************************/
  testNumber(pos: string) {
    if (this.showNumberError === false) {
      this.showNumberError = !isNaN(+pos);
    }
  }
  /**************************************************************************
   * @description test if there is an empty field , enable button add if all fields are not empty
   *************************************************************************/
  testRequired() {
    return (this.sendSection.invalid) ;
  }
}
