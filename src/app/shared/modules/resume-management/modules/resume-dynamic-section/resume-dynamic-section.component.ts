import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-resume-dynamic-section',
  templateUrl: './resume-dynamic-section.component.html',
  styleUrls: ['./resume-dynamic-section.component.scss']
})
export class ResumeDynamicSectionComponent implements OnInit {
  sendSection: FormGroup;
  arraySectionCount = 0;
  Section: IResumeSectionModel;
  showSection = false;
  SectionArray: IResumeSectionModel[] = [];
  resume_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-SEC`;
  get getSection() {
    return this.SectionArray;
  }
  showCustomSection() {
    this.showSection = !this.showSection;
  }

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
               ) { }
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
                console.log('response', responseOne);
                this.SectionArray = responseOne;
                if (this.SectionArray.length !== 0) {
                  console.log('section array on init= ', this.SectionArray);
                  this.showSection = true;
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
    console.log('section array =', this.SectionArray);

  }
  ngOnInit(): void {
    this.createForm();
    this.getDynamicSectionInfo();
    console.log('length=', this.SectionArray.length);
    }
  createForm() {
    this.sendSection = this.fb.group({
      section_title: '',
      section_desc: '',
    });
  }

  createSection() {
    this.Section = this.sendSection.value;
    this.Section.resume_code = this.resume_code;
    this.Section.section_code = Math.random().toString();
    this.Section.index = this.arraySectionCount.toString();
    if (this.sendSection.valid) {
      this.resumeService.addCustomSection(this.Section).subscribe(data => console.log('Section =', data));
      this.getSection.push(this.Section);
    } else { console.log('Form is not valid');
    }
    this.arraySectionCount++;
    this.sendSection.reset();
  }
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }
}
