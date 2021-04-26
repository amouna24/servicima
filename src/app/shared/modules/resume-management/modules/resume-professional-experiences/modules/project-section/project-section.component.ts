import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';
import { IResumeProjectDetailsModel } from '@shared/models/resumeProjectDetails.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { Router } from '@angular/router';
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
  ProDetails: IResumeProjectDetailsModel;
  ProSectionDetails: IResumeProjectDetailsSectionModel[];
  project_details_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P-D` ;
  showDesc = true;
  showSec = false;
  select = 'desc';
  list = 'List';
  desc = 'desc';
  @Input() project_code = '';

  get getProjectSection() {
    return this.proDetailsArray ;
  }
  get inputFields() {
    return this.sendProSectionDetails.get('Field') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getProjectDetailsInfo();
    this.createFormProDetails();
    this.createFormSectionDetails();
    this.project_details_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-R-PE-P-D`;
    this.sendProDetails.get('select').valueChanges.subscribe(selectedValue => {
     this.select = selectedValue;
    });
  }
  createFormProDetails() {
    this.sendProDetails = this.fb.group({
      project_detail_title: '',
      project_detail_desc: '',
        select: '',
      });
  }
  getProjectDetailsInfo() {
    this.resumeService.getProjectDetails(
      // tslint:disable-next-line:max-line-length
      `?project_code=${this.project_code}`)
      .subscribe(
        (response) => {
          console.log('response=', response);
          this.proDetailsArray = response;
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
  createFormSectionDetails() {
    this.sendProSectionDetails = this.fb.group({
      Field: this.fb.array([this.fb.group({
        project_details_section_desc: '',
      })])});
  }
  /**
   * @description Create Technical skill
   */
  createProSectionDetails() {
    this.ProSectionDetails = this.sendProSectionDetails.controls.Field.value;
    this.ProSectionDetails[this.arrayProSectionDetailsCount].project_details_section_code = `WID-${Math.
    floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P-D-S`;
    this.ProSectionDetails[this.arrayProSectionDetailsCount].project_details_code = this.project_details_code;
    if (this.sendProSectionDetails.controls.Field.valid) {
      console.log('ProExp input= ', this.ProSectionDetails[this.arrayProSectionDetailsCount]);
      this.resumeService.
      addProjectDetailsSection(this.ProSectionDetails[this.arrayProSectionDetailsCount]).
      subscribe(dataSection => console.log('Section details =', dataSection));
      this.inputFields.push(this.fb.group({
        project_details_section_desc: '',
      }));
    } else { console.log('Form is not valid');
    }
    this.arrayProSectionDetailsCount++;

  }
  createProDetails() {
    this.ProDetails = this.sendProDetails.value;
    this.ProDetails.project_details_code = this.project_details_code;
    this.ProDetails.project_code = this.project_code;
    if (this.sendProDetails.valid) {
      console.log('project details=', this.ProDetails);
      this.resumeService.addProjectDetails(this.ProDetails).subscribe(dataProDeta => console.log('Project details =', dataProDeta));
      this.proDetailsArray.push(this.ProDetails);
    } else { console.log('Form is not valid');
    }
    this.arrayProDetailsCount++;
    this.sendProDetails.reset();
  }

  onSelect() {
    console.log(this.select);
    if (this.select === 'desc') {
      this.showDesc = false;
      this.showSec = true;
    } else {
      this.showDesc = true;
      this.showSec = false;
    }

}

}
