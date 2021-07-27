import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

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
    private router: Router,
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
  currentSection: IResumeSectionModel;
  previousSection: IResumeSectionModel;
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getDynamicSectionInfo();
    this.createForm();
    }
  /**************************************************************************
   * @description Function that change the index between selected Section using cdkDropListGroup
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
/*  await  this.resumeService.getCustomSection(`?index=${event.previousIndex.toString()}`).subscribe(
      (res) => {
          this.previousSection = res[0];
        this.previousSection.section_code = this.previousSection.ResumeSectionKey.section_code;
        this.previousSection.resume_code = this.previousSection.ResumeSectionKey.resume_code;
          this.previousSection.index = event.currentIndex.toString();
        console.log('previous =', this.previousSection);
        this.resumeService.updateCustomSection(this.previousSection).subscribe( () => {
          console.log('previous updated');
        });
        this.resumeService.getCustomSection(`?index=${event.currentIndex.toString()}`).subscribe(
          (resCurrent) => {
            this.currentSection = resCurrent[0];
            this.currentSection.section_code = this.currentSection.ResumeSectionKey.section_code;
            this.currentSection.resume_code = this.currentSection.ResumeSectionKey.resume_code;
            this.currentSection.index = event.previousIndex.toString();
            console.log('current =', this.currentSection);
            this.resumeService.updateCustomSection(this.currentSection).subscribe( () => {
              console.log('current updated');
            });

          }
        );
      }
    );*/
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
          if (response['msg_code'] !== '0004') {
            this.resume_code = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getCustomSection(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.SectionArray = responseOne;
                  this.arraySectionCount = +this.SectionArray[this.SectionArray.length - 1].index + 1;
                  console.log('section array count =',  this.arraySectionCount);
                  this.SectionArray.forEach(
                    (sec) => {
                      sec.section_code = sec.ResumeSectionKey.section_code;
                    }
                  );
                  if (this.SectionArray.length !== 0) {
                    this.showSection = true;
                  }
                } }
              ,
              (error) => {
                if (error.error.msg_code === '0004') {
                }
              },
            );
          } else {
            this.router.navigate(['/candidate/resume/']);
          }},
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
  /**
   * @description Initialization of Custom Section Form
   */
  createForm() {
    this.sendSection = this.fb.group({
      section_title:  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      section_desc: '',
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
        this.getDynamicSectionInfo();
      });
    }} else {
      this.sectionUpdate = this.sendSection.value;
      this.sectionUpdate.section_code = this.section_code;
      this.sectionUpdate.index = this.indexUpdate.toString();
      this.sectionUpdate.resume_code = this.resume_code;
      this.sectionUpdate._id = this._id;
      if  (this.sendSection.valid && !this.showNumberError) {
      this.resumeService.updateCustomSection(this.sectionUpdate).subscribe(data => console.log('custom section updated =', data));
      this.SectionArray[this.indexUpdate] = this.sectionUpdate;
        this.button = 'Add'; }
    }
    this.sendSection.reset();
    this.showNumberError = false;
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
      title: 'Delete This Section ?',
      description: 'Are you sure ?',
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
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }

}
