import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';

@Component({
  selector: 'wid-resume-dynamic-section',
  templateUrl: './resume-dynamic-section.component.html',
  styleUrls: ['./resume-dynamic-section.component.scss']
})
export class ResumeDynamicSectionComponent implements OnInit {
  sendSection: FormGroup;
  arraySectionCount = 0;
  Section: IResumeSectionModel;
  get inputFields() {
    return this.sendSection.get('Field') as FormArray;
  }
  constructor() { }

  ngOnInit(): void {
  }

  createSection() {
  }
}
