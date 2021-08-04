import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { blueToGrey, downLine, GreyToBlue } from '@shared/animations/animations';

@Component({
  selector: 'wid-resume-dynamic-section',
  templateUrl: './resume-dynamic-section.component.html',
  styleUrls: ['./resume-dynamic-section.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
  ],
})
export class ResumeDynamicSectionComponent implements OnInit {
  showNumberError: boolean;
  sendSection: FormGroup;
  arraySectionCount = 0;
  Section: IResumeSectionModel;
  showSection: boolean;
  SectionArray: IResumeSectionModel[];
  resumeCode: string;
  button: string;
  section_code: string;
  indexUpdate = 0;
  sectionUpdate: IResumeSectionModel;
  id: string;
  subscriptionModal: Subscription;

  /**********************************************************************
   * @description Resume Dynamic Section constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
    private router: Router,
  ) {
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.showNumberError = false;
    this.showSection = false;
    this.SectionArray = [];
    this.button = 'Add';
    this.getDynamicSectionInfo();
    this.createForm();
  }

  /**************************************************************************
   * @description Function that change the index between selected Section using cdkDropListGroup
   * @param event event of the drag and drop array
   *************************************************************************/
  async drop(event: CdkDragDrop<IResumeSectionModel[]>) {
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
      `?email_address=${this.userService.connectedUser$
        .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
        .getValue().user[0]['company_email']}`).subscribe((response) => {
        if (response['msg_code'] !== '0004') {
          this.resumeCode = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getCustomSection(
            `?resume_code=${this.resumeCode}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.SectionArray = responseOne;
                  this.arraySectionCount = +this.SectionArray[this.SectionArray.length - 1].index + 1;
                  this.SectionArray.forEach(
                    (sec) => {
                      sec.section_code = sec.ResumeSectionKey.section_code;
                    }
                  );
                  if (this.SectionArray.length !== 0) {
                    this.showSection = true;
                  }
                }
              }
              ,
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
   * @description Show The Form of Custom Section
   *************************************************************************/
  showCustomSection() {
    this.showSection = !this.showSection;
  }

  /*************************************************************************
   * @description Initialization of Custom Section Form
   *************************************************************************/
  createForm() {
    this.sendSection = this.fb.group({
      section_title: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      section_desc: '',
    });
  }

  /**************************************************************************
   * @description Create or Update a Custom Section
   *************************************************************************/
  createUpdateSection() {
    if (this.button === 'Add') {
      this.Section = this.sendSection.value;
      this.Section.resume_code = this.resumeCode;
      this.Section.section_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-SEC`;
      this.Section.index = this.arraySectionCount.toString();
      if (this.sendSection.valid) {
        this.resumeService.addCustomSection(this.Section).subscribe(data => {
          this.getDynamicSectionInfo();
        });
      }
    } else {
      this.sectionUpdate = this.sendSection.value;
      this.sectionUpdate.section_code = this.section_code;
      this.sectionUpdate.index = this.indexUpdate.toString();
      this.sectionUpdate.resume_code = this.resumeCode;
      this.sectionUpdate._id = this.id;
      if (this.sendSection.valid && !this.showNumberError) {
        this.resumeService.updateCustomSection(this.sectionUpdate).subscribe(data => console.log('custom section updated =', data));
        this.SectionArray[this.indexUpdate] = this.sectionUpdate;
        this.button = 'Add';
      }
    }
    this.sendSection.reset();
    this.showNumberError = false;
  }

  /**************************************************************************
   * @description Set data of a selected Custom section and set it in the current form
   * @param dynamicSection the Dynamic section model
   * @param pointIndex the index of the selected Dynamic Section
   *************************************************************************/
  editForm(dynamicSection: IResumeSectionModel, pointIndex: number) {
    this.sendSection.patchValue({
      section_title: dynamicSection.section_title,
      section_desc: dynamicSection.section_desc,
    });
    this.id = dynamicSection._id;
    this.section_code = dynamicSection.ResumeSectionKey.section_code;
    this.indexUpdate = pointIndex;
    this.button = 'Save';
  }

  /**************************************************************************
   * @description Delete the selected Custom section
   * @param id the id of the deleted dynamic section
   * @param pointIndex the index of the deleted dynamic section
   *************************************************************************/
  deleteSection(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-section',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteCustomSection(id).subscribe(data => console.log('Deleted'));
            this.SectionArray.forEach((value, index) => {
              if (index === pointIndex) {
                this.SectionArray.splice(index, 1);
              }
            });
            this.button = 'Add';
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
}
