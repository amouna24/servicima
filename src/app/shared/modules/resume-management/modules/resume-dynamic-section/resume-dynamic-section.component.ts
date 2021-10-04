import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { Router } from '@angular/router';
import { blueToGrey, downLine, GreyToBlue, showBloc, dataAppearance } from '@shared/animations/animations';

@Component({
  selector: 'wid-resume-dynamic-section',
  templateUrl: './resume-dynamic-section.component.html',
  styleUrls: ['./resume-dynamic-section.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    dataAppearance,
    showBloc
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
  showEmpty = true;
  companyUserType: string;

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
    this.resumeCode = this.router.getCurrentNavigation()?.extras?.state?.resumeCode;
    this.companyUserType = this.router.getCurrentNavigation()?.extras?.state?.companyUserType;
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.showNumberError = false;
    this.SectionArray = [];
    this.button = 'Add';
    this.getDynamicSectionInfo();
    this.createForm();
  }
  /**************************************************************************
   * @description Get Dynamic section Data from Resume Service
   *************************************************************************/
  getDynamicSectionInfo() {
    if (this.resumeCode) {
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
              this.showSection = true;
            } else {
              this.showSection = false;
            }
            this.showEmpty = false;
          }
          ,
          (error) => {
            if (error.error.msg_code === '0004') {
            }
          },
        );
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY' && !this.resumeCode) {
      this.router.navigate(['manager/resume/']);
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE' ||
      this.userService.connectedUser$.getValue().user[0].user_type === 'COLLABORATOR') {
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
                    this.showSection = true;
                  } else {
                    this.showSection = false;
                  }
                  this.showEmpty = false;

                }
                ,
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
          this.resumeService.getCustomSection(
            `?section_code=${this.Section.section_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.SectionArray.push(responseOne[0]);
                }});          });
      }
    } else {
      this.sectionUpdate = this.sendSection.value;
      this.sectionUpdate.section_code = this.section_code;
      this.sectionUpdate.index = this.indexUpdate.toString();
      this.sectionUpdate.resume_code = this.resumeCode;
      this.sectionUpdate._id = this.id;
      if (this.sendSection.valid && !this.showNumberError) {
        this.resumeService.updateCustomSection(this.sectionUpdate).subscribe(data => {
          console.log('custom section updated =', data);
          this.SectionArray.splice(this.indexUpdate, 0, data);
        });
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
    this.SectionArray.splice(pointIndex, 1);
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
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  /**************************************************************************
   * @description Show indexation
   *************************************************************************/
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
  /**************************************************************************
   * @description Route to next page or to the previous page
   * @param typeRoute type of route previous or next
   *************************************************************************/
  routeNextBack(typeRoute: string) {
    if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
      if (typeRoute === 'next') {
        this.router.navigate(['/manager/resume/language'], {
          state: {
            resumeCode: this.resumeCode,
            companyUserType: this.companyUserType,
          }
        });
      } else {
        this.router.navigate(['/manager/resume/professionalExperience'], {
          state: {
            resumeCode: this.resumeCode,
            companyUserType: this.companyUserType,
          }
        });
      }
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE') {
      if (typeRoute === 'next') {
        this.router.navigate(['/candidate/resume/language'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/candidate/resume/professionalExperience'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      }
    } else {
      if (typeRoute === 'next') {
        this.router.navigate(['/collaborator/resume/language'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/collaborator/resume/professionalExperience'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      }
    }

  }
}
