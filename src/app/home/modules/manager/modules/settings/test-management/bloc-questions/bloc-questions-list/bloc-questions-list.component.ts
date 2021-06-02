import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IConfig } from '@shared/models/configDataTable.model';
import { DataTableConfigComponent } from '@shared/modules/dynamic-data-table/components/data-table-config/data-table-config.component';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-bloc-questions-list',
  templateUrl: './bloc-questions-list.component.html',
  styleUrls: ['./bloc-questions-list.component.scss'],
})
export class BlocQuestionsListComponent implements OnInit {
  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() tableCode: string;
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  @Input() header: {
    title: string, addActionURL: string, addActionText: string, type: string,
    addActionDialog: { modalName: string, modalComponent: string, data: object, width: string, height: string }
  };
  columns: IConfig[] = [];
  columnsList: string[] = [];
  modalConfiguration: object[];
  displayedColumns: IConfig[] = [];
  canBeDisplayedColumns: IConfig[] = [];
  canBeFilteredColumns: IConfig[] = [];
  blocData = [];
  subscriptionModal: Subscription;

  private code = '';

  constructor(
    private modalService: ModalService,
    private localStorageService: LocalStorageService,
    private dynamicDataTableService: DynamicDataTableService,
    private testService: TestService,
    private router: Router,
    private modalServices: ModalService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading.next(true);
    this.getTableData();
  }

  getTableData() {
    this.testService.getQuestionBloc(`?application_id=5eac544a92809d7cd5dae21f`)
      .subscribe(
        (response) => {
          response.map(async res => {
            this.getTechTitle(res.TestQuestionBlocKey.test_technology_code).then(
              (code) => {
                this.blocData.push({
                  test_bloc_title: res.test_question_bloc_title,
                  test_bloc_technology: code,
                  test_bloc_total_number: res.question_nbr,
                  test_question_bloc_desc: res.test_question_bloc_desc,
                  _id: res._id,
                  test_question_bloc_code: res.TestQuestionBlocKey.test_question_bloc_code,
                  technology_code: res.TestQuestionBlocKey.test_technology_code,
                });
                this.tableData.next(this.blocData);

                this.isLoading.next(false);
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
    console.log('data table=', this.tableData);
  }

  async getTechTitle(tech_code): Promise<string> {
    let code: string;
    const get = this.testService.getTechnologies(`?test_technology_code=${tech_code}`).toPromise();
    await get.then((data) => {
      console.log(data[0]);
      code = data[0].technology_title;
    });
    return code;
  }
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): this.showBloc(rowAction.data);
        break;
      case ('update'): this.updateBloc(rowAction.data);
        break;
      case('delete'): this.deleteBloc(rowAction.data);
    }
  }

  private showBloc(data) {
    this.router.navigate(['/manager/settings/bloc-question/details'],
      { state: {
          test_bloc_title: data.test_bloc_title,
          test_bloc_technology: data.test_bloc_technology,
          test_bloc_total_number: data.test_bloc_total_number,
          test_question_bloc_desc: data.test_question_bloc_desc,
          _id: data._id,
          test_question_bloc_code: data.test_question_bloc_code,
        }
      });
  }

  private updateBloc(data) {
    this.router.navigate(['/manager/settings/bloc-question/edit'],
      { state: {
          test_bloc_title: data.test_bloc_title,
          test_bloc_technology: data.technology_code,
          test_bloc_total_number: data.test_bloc_total_number,
          test_question_bloc_desc: data.test_question_bloc_desc,
          _id: data._id,
          test_question_bloc_code: data.test_question_bloc_code,
        }
      });
  }

  private deleteBloc(data) {
    const confirmation = {
      code: 'delete',
      title: 'Delete This Bloc ?',
      status: data['_id']
    };
    console.log('_id=', data);
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.testService.deleteQuestionBloc(data['_id']).subscribe(dataBloc => {
              console.log('Deleted');
              this.getTableData();
            });
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
}
