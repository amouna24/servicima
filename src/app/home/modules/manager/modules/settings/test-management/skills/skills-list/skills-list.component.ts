import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IConfig } from '@shared/models/configDataTable.model';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent implements OnInit {
  tableData = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  header: { title: string, addActionURL: string, addActionText: string, type: string,
    addActionDialog: { modalName: string, modalComponent: string, data: object, width: string, height: string } };
  columns: IConfig[] = [];
  columnsList: string[] = [];
  modalConfiguration: object[];
  displayedColumns: IConfig[]  = [];
  canBeDisplayedColumns: IConfig[] = [];
  SkillsList = [];
  subscriptionModal: Subscription;
  subscriptions: Subscription[] = [];
  constructor(
    private testService: TestService,
    private router: Router,
    private modalServices: ModalService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getTableData().then((data) => {
      this.tableData.next(data);
    });
  }
  getTableData() {
    const tableRes = [];
    this.isLoading.next(true);
    return  new Promise<any>(resolve => {
      this.testService.getSkills(`?application_id=${this.utilsService.getApplicationID('SERVICIMA')}`)
        .subscribe(
          (response) => {
            this.isLoading.next(true);
            if (response['msg_code'] === '0004') {
              resolve([]);
              this.isLoading.next(false);
            } else {
            response['results'].map(
              async (value) => {
                let object: object;
                object = {
                  skill_title: value.skill_title,
                  level: value.test_level_code,
                  technology:
                    await this.getTechno(value.TestSkillsKey.test_skill_code) ,
                  _id: value._id,
                  test_skill_code: value.TestSkillsKey.test_skill_code,
                };
                tableRes.push(object);

                if (response['results'].length === tableRes.length) {
                  response['results'] = tableRes;
                  resolve(response['results']);
                  this.isLoading.next(false);
                }
              }
            );
            }
          },
          (error) => {
            console.log('error', error);

          },
        );
    });
  }
  getTechno(test_skill_code) {
    const techList = [];
    return  new Promise<any>(resolve => {
      this.testService.getTechnologySkills(`?test_skill_code=${test_skill_code}`)
        .subscribe(resTechSkill => {
          resTechSkill.map( async TechSkill => {
            this.testService.getTechnologies(`?test_technology_code=${TechSkill.TestTechnologySkillKey.test_technology_code}`)
              .subscribe(resTech => {

                resTech.map( Tech => {
                  techList.push(Tech.technology_title);
                  if (techList.length === resTechSkill.length) {
                    resolve (techList);
                  }
                });
              });
          });
        });
    });
  }
  switchAction(rowAction: any) {
    switch (rowAction.actionType.name) {
      case ('update'): this.updateSkill(rowAction.data);
        break;
      case('Delete'): this.deleteSkill(rowAction.data);
    }
  }
  deleteSkill(data: any) {
    data.map( (deletedObject) => {
      const confirmation = {
        code: 'delete',
        title: 'Delete This Skills ?',
        description: 'Are you sure ? '
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .subscribe(
          (resModal) => {
            if (resModal === true) {
              this.testService.deleteSkills(deletedObject['_id']).subscribe(() => {
                console.log('Deleted');
                this.getTableData().then((res) => {
                  this.tableData.next(res);
                });
              });
            }
            this.subscriptionModal.unsubscribe();
          }
        );
    });

  }
  /**
   * @description : update role
   * @param data: object to update
   */
  updateSkill(data) {
    this.router.navigate(['/manager/settings/skills/edit'],
      { state: {
          id: data._id,
          skill_title: data.skill_title,
          test_level_code: data.level,
          test_skill_code: data.test_skill_code,
          technology:  data.technology,
        }
      });
  }
}
