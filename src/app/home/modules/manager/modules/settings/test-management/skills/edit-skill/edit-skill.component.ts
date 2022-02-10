import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import { IConfig } from '@shared/models/configDataTable.model';
import { ITestSkillsModel } from '@shared/models/testSkills.model';
import { ITestTechnologySkillsModel } from '@shared/models/testTechnologySkills.model';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { HelperService } from '@core/services/helper/helper.service';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-edit-skill',
  templateUrl: './edit-skill.component.html',
  styleUrls: ['./edit-skill.component.scss']
})
export class EditSkillComponent implements OnInit {
  sendUpdateTestSkill: FormGroup;
  testSkill: ITestSkillsModel;
  displayedColumnsForm: FormGroup;
  columns: IConfig[] = [];
  displayedColumns: IConfig[] = [];
  canBeDisplayedColumns: IConfig[] = [];
  canBeDisplayedColumnsForm: FormGroup;
  skillTech: ITestTechnologySkillsModel;
  skill_title = this.router.getCurrentNavigation().extras.state?.skill_title;
  test_level_code = this.router.getCurrentNavigation().extras.state?.test_level_code;
  _id = this.router.getCurrentNavigation().extras.state?.id;
  test_skill_code = this.router.getCurrentNavigation().extras.state?.test_skill_code;
  technology  = this.router.getCurrentNavigation().extras.state?.technology;
  private canDelete = false;
  constructor(
    private fb: FormBuilder,
    private dynamicDataTableService: DynamicDataTableService,
    private modalService: ModalService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService,
    private testService: TestService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getTechnologiesInfo();
    this.getDisplayedColumns();
    this.displayedColumnsForm = new FormGroup({
      displayedColumns: new FormArray([])
    });
    this.canBeDisplayedColumnsForm = new FormGroup({
      canBeDisplayedColumns: new FormArray([])
    });
  }
  /**
   * @description Inisialization of the Add test skill form
   */
  createForm() {
    this.sendUpdateTestSkill = this.fb.group({
      skill_title :  [ this.skill_title, [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      test_level_code: [this.test_level_code, Validators.required]
    });
  }

  getTechnologiesInfo() {
    this.testService.getTechnologies(`?application_id=5eac544a92809d7cd5dae21f`)
      .subscribe(
        (response) => {
          response.forEach(res => {
            let i = 0;
            this.technology.forEach(resDis => {
                if (resDis === res.technology_title) {
                  i = 1;
                }
              }
            );
            if (i === 0) {
              this.canBeDisplayedColumns.push(
                {
                  prop: res.TestTechnologyKey.test_technology_code,
                  name: res.technology_title,
                  type: 'text',
                });
            }
          });
        },
        (error) => {
          if (error.error.msg_code === '0004') {
            console.log('empty table');
          }
        },
      );
  }
  getDisplayedColumns() {
    this.testService.getTechnologies(`?application_id=5eac544a92809d7cd5dae21f`)
      .subscribe(
        (response) => {
          response.forEach(res => {
            this.technology.forEach(resDis => {
                if (resDis === res.technology_title) {
                  this.displayedColumns.push(
                    {
                      prop: res.TestTechnologyKey.test_technology_code,
                      name: resDis,
                      type: 'text',
                    }
                  );
                  console.log('tech code', res.TestTechnologyKey.test_technology_code);
                }
              }
            );

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
  /**************************************************************************
   * @description check display column
   *************************************************************************/
  deleteTechno(): Promise<boolean> {
    let deletedItems ;
    return new Promise<boolean>(
      async (resolve) => {
        await this.testService.getTechnologySkills(`?test_skill_code=${this.test_skill_code}`)
          .toPromise()
          .then(
            dataTechSkill => {
              deletedItems = dataTechSkill.length;
              dataTechSkill.forEach((resTech) => {
                this.testService.deleteTechnologySkills(resTech._id).subscribe((data) => {
                  console.log('deleted', data);
                  deletedItems--;
                  if (deletedItems === 0) {
                    resolve(true);
                  }

                });

                  });
            });
      }
    );

  }

  /**************************************************************************
   * @description check display column
   *************************************************************************/
  async addTech() {
    console.log('displayed columns', this.displayedColumns);
    await this.displayedColumns.forEach(res => {
      this.skillTech = {
        application_id: '5eac544a92809d7cd5dae21f',
        test_skill_code: this.test_skill_code,
        test_technology_code: res.prop,
      };
      this.testService.addTechnologySkills(this.skillTech).subscribe(dataSkillTech => {
      });
    });
  }
  updateSkill() {
    this.testSkill = this.sendUpdateTestSkill.value;
    this.testSkill.test_skill_code =  this.test_skill_code;
    this.testSkill.application_id = '5eac544a92809d7cd5dae21f';
    this.testSkill._id = this._id;
      this.testService.updateSkills(this.testSkill).subscribe( async data => {
        console.log(data);
      });
      this.deleteTechno().then(
        (dataB) => {
          console.log('dataB', dataB);
          if (dataB) {
            this.addTech();
          }
          this.router.navigate(['/manager/settings/skills/']);
        }
      );

  }

  testButton() {
    return this.sendUpdateTestSkill.invalid || this.displayedColumns.length <= 0;
  }
}
