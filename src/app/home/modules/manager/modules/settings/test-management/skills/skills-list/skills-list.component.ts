import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IConfig } from '@shared/models/configDataTable.model';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';

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
      this.testService.getSkills(`?application_id=5eac544a92809d7cd5dae21f`)
        .subscribe(
          (response) => {
            response.map(
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
                if (response.length === tableRes.length) {
                  this.isLoading.next(false);
                  resolve(tableRes);
                }
              }
            );
          },
          (error) => {
            if (error.error.msg_code === '0004') {
              console.log('empty table');
            }
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
    switch (rowAction.actionType) {
      case ('show'): this.showSkill(rowAction.data);
        break;
      case ('update'): this.updateSkill(rowAction.data);
        break;
      case('delete'): this.deleteSkill(rowAction.data);
    }
  }
  deleteSkill(id: string) {
    const confirmation = {
      code: 'delete',
      title: 'Delete This Skills ?',
      status: id['_id']
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.testService.deleteSkills(id['_id']).subscribe(() => {
              console.log('Deleted');
              this.getTableData().then((data) => {
                this.tableData.next(data);
              });
            });
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  private showSkill(data) {
    console.log('show techno ', this.tableData['skill_title'].technology);
    this.router.navigate(['/manager/settings/skills/edit'],
      { state: {
          id: data._id,
          skill_title: data.skill_title,
          test_level_code: data.test_level_code,
          test_skill_code: data.test_skill_code,
          technology: this.tableData[data['_id']].technology,
        }
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
