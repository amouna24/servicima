import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ITestSkillsModel } from '@shared/models/testSkills.model';
import * as _ from 'lodash';
import { IConfig } from '@shared/models/configDataTable.model';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HelperService } from '@core/services/helper/helper.service';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';
import { ITestTechnologySkillsModel } from '@shared/models/testTechnologySkills.model';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {
  @Input() tableCode: string;
  sendAddTestSkill: FormGroup;
  testSkill: ITestSkillsModel;
  displayedColumnsForm: FormGroup;
  columns: IConfig[] = [];
  displayedColumns: IConfig[];
  canBeDisplayedColumns: IConfig[] = [];
  canBeDisplayedColumnsForm: FormGroup;
  skillTech: ITestTechnologySkillsModel;
  applicationId: string;
  companyEmailAddress: string;

  constructor(
    private fb: FormBuilder,
    private dynamicDataTableService: DynamicDataTableService,
    private modalService: ModalService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private testService: TestService,
    private router: Router,
    private userService: UserService,
    ) { }

  ngOnInit(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.displayedColumns = [];
    this.createForm();
    this.getTechnologiesInfo();
    this.getConnectedUser();
    this.displayedColumnsForm = new FormGroup({
      displayedColumns: new FormArray([])
    });
    this.canBeDisplayedColumnsForm = new FormGroup({
      canBeDisplayedColumns: new FormArray([])
    });
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];          }
        });
  }

  /**
   * @description Inisialization of the Add test skill form
   */
  createForm() {
    this.sendAddTestSkill = this.fb.group({
      skill_title :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      test_level_code: ['junior', Validators.required],
    });
  }
  getTechnologiesInfo() {
    this.testService.getTechnologies(`?application_id=${this.applicationId}&company_email=${this.companyEmailAddress}`)
      .subscribe(
        (response) => {
          response.forEach(res => {
            this.canBeDisplayedColumns.push(
              {
                prop: res.TestTechnologyKey.test_technology_code,
                name: res.technology_title,
                type: 'text',
              });
          });
        },
        (error) => {
          if (error.error.msg_code === '0004') {
            console.log('empty table');
          }
        },
      );
  }
  /**************************************************************************
   * @description display table config
   *************************************************************************/
  onDropCanBeDisplayed(event: CdkDragDrop<string[]>) {
    this.displayColumn(event, this.canBeDisplayedColumns);
    this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');
  }
  displayColumn(event: CdkDragDrop<string[]>, column: IConfig[]) {
    let indexP: number = event.previousIndex;
    column = _.sortBy(column, 'index');
    if (event.currentIndex > event.previousIndex) {
      while (indexP < event.currentIndex) {
        this.permutation(indexP, column);
        indexP++;
        column = _.sortBy(column, 'index');
      }
    } else {
      while (indexP > event.currentIndex) {
        this.permutation(indexP - 1, column);
        indexP--;
        column = _.sortBy(column, 'index');
      }
    }
  }
  /**************************************************************************
   * @description permutation index for two column
   *************************************************************************/
  permutation(indexP: number, column: IConfig[]) {
    const temp: number = column[indexP].index;
    column[indexP].index = column[indexP + 1].index;
    column[indexP + 1].index = temp;
  }
  checkCanBeDisplayedColumn(event) {
    const canBeDisplayedColumns = this.canBeDisplayedColumnsForm.get('canBeDisplayedColumns') as FormArray;
    if (event['checked']) {
      canBeDisplayedColumns.push(new FormControl(event['source']['value']));
    } else {
      const i = canBeDisplayedColumns.controls.findIndex(x => x.value === event['source']['value']);
      canBeDisplayedColumns.removeAt(i);
    }
  }
  addToDisplayColumn() {
    const canBeDisplayedColumnsFormArray = this.canBeDisplayedColumnsForm.get('canBeDisplayedColumns') as FormArray;
    const canBeDisplayedColumns = canBeDisplayedColumnsFormArray.value;
    this.displayedColumns.push(...canBeDisplayedColumns);
    this.helperService.removeSubArrayFromArray(this.canBeDisplayedColumns, canBeDisplayedColumns, 'prop');
    this.displayedColumns = _.sortBy(this.displayedColumns, 'index');
    canBeDisplayedColumnsFormArray.clear();
  }
  addToCanBeDisplayColumn() {
    const displayedColumnsFormArray = this.displayedColumnsForm.get('displayedColumns') as FormArray;
    const displayedColumns = displayedColumnsFormArray.value;
    this.canBeDisplayedColumns.push(...displayedColumns);
    this.helperService.removeSubArrayFromArray(this.displayedColumns, displayedColumns, 'prop');
    this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');
    displayedColumnsFormArray.clear();
  }
  /**************************************************************************
   * @description change index for display column
   *************************************************************************/
  onDropDisplayed(event: CdkDragDrop<string[]>) {
    this.displayColumn(event, this.displayedColumns);
    this.displayedColumns = _.sortBy(this.displayedColumns, 'index');
  }
  /**************************************************************************
   * @description check display column
   *************************************************************************/
  checkDisplayedColumn(event) {
    const displayedColumns = this.displayedColumnsForm.get('displayedColumns') as FormArray;
    if (event['checked']) {
      displayedColumns.push(new FormControl(event['source']['value']));
    } else {
      const i = displayedColumns.controls.findIndex(x => x.value === event['source']['value']);
      displayedColumns.removeAt(i);
    }
  }
  createSkill() {
    this.testSkill = this.sendAddTestSkill.value;
    this.testSkill.test_skill_code =  `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SKILL`;
    this.testSkill.application_id = this.applicationId;
    this.testSkill.company_email = this.companyEmailAddress;
    if (this.sendAddTestSkill.valid && this.displayedColumns.length > 0) {
      this.testService.addSkills(this.testSkill).subscribe(data => {
        this.displayedColumns.forEach(res => {
          this.skillTech = {
          application_id: this.applicationId,
          company_email: this.companyEmailAddress,
          test_skill_code: this.testSkill.test_skill_code,
          test_technology_code: res.prop,
          };
          this.testService.addTechnologySkills(this.skillTech).subscribe(dataSkillTech => {
            console.log('skill tech added', dataSkillTech);
          });
        });
        this.router.navigate(['/manager/settings/skills/']);
      });
    }
  }
  testButton() {
    return this.sendAddTestSkill.invalid || this.displayedColumns.length <= 0;
}
}
