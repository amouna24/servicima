import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'wid-project-section',
  templateUrl: './project-section.component.html',
  styleUrls: ['./project-section.component.scss']
})
export class ProjectSectionComponent implements OnInit {
  sendProjectSection: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  createProjectSection() {

  }
}
