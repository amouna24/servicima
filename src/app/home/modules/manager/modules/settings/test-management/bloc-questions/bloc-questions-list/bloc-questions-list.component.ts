import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IConfig } from '@shared/models/configDataTable.model';
import { ModalService } from '@core/services/modal/modal.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { CryptoService } from '@core/services/crypto/crypto.service';
import { UtilsService } from '@core/services/utils/utils.service';

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
  applicationId: string;
  companyEmailAddress: string;
  columns: IConfig[] = [];
  columnsList: string[] = [];
  modalConfiguration: object[];
  displayedColumns: IConfig[] = [];
  canBeDisplayedColumns: IConfig[] = [];
  blocData = [];
  subscriptionModal: Subscription;

  constructor(
    private modalService: ModalService,
    private localStorageService: LocalStorageService,
    private dynamicDataTableService: DynamicDataTableService,
    private testService: TestService,
    private router: Router,
    private modalServices: ModalService,
    private userService: UserService,
    private cryptoService: CryptoService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.getConnectedUser();
    this.getTableData().then((data) => {
      this.tableData.next(data);
    });  }

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

  getTableData() {
    this.blocData = [];
    this.isLoading.next(true);
    return  new Promise<any>(resolve => {
      this.testService.getQuestionBloc(`?application_id=${this.applicationId}&company_email=ALL`)
        .subscribe(
          (response) => {
            console.log('response=', response);
            this.isLoading.next(true);
            if (response['msg_code'] === '0004') {
              resolve([]);
              this.isLoading.next(false);
            } else {
            response['results'].map(async res => {
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
                    image: res.image,
                    free:  res.free,
                    price: res.price
                  });
                  if (response['results'].length === this.blocData.length) {
                    response['results'] = this.blocData;
                    resolve(response['results']);
                    this.isLoading.next(false);
                  }
                }
              );

            }); }
          },
          (error) => {
            if (error.error.msg_code === '0004') {
              console.log('empty table');
              resolve([]);
              this.isLoading.next(false);
            }
          },
        );
    });
  }

  async getTechTitle(tech_code): Promise<string> {
    let code: string;
    const get = this.testService.
    getTechnologies(`?test_technology_code=${tech_code}&application_id=${this.applicationId}&company_email=ALL`).toPromise();
    await get.then((data) => {
      code = data[0]?.technology_title;
    });
    return code;
  }

  switchAction(rowAction: any) {
    switch (rowAction.actionType.name) {
      case ('show'): this.showBloc(rowAction.data);
        break;
      case ('update'): this.updateBloc(rowAction.data);
        break;
      case('delete'): this.deleteBloc(rowAction.data);
    }
  }

  private showBloc(data) {
    const queryObject = {
      test_bloc_title: data[0].test_bloc_title,
      test_bloc_technology: data[0].test_bloc_technology,
      test_bloc_total_number: data[0].test_bloc_total_number,
      test_question_bloc_desc: data[0].test_question_bloc_desc,
      _id: data[0]._id,
      test_question_bloc_code: data[0].test_question_bloc_code,
    };
    this.utilsService.navigateWithQueryParam('/manager/settings/bloc-question/details', queryObject);
  }

  private updateBloc(data) {
    const queryParamObject =  {
      test_bloc_title:  data.test_bloc_title,
      test_bloc_technology:  data.technology_code,
      test_bloc_total_number:  data.test_bloc_total_number,
      test_question_bloc_desc:  data.test_question_bloc_desc,
      _id:  data._id,
      test_question_bloc_code:  data.test_question_bloc_code,
      free: data.free,
      price: data.price,
      image: data.image,
    };
    this.utilsService.navigateWithQueryParam('/manager/settings/bloc-question/edit', queryParamObject);
  }

  private deleteBloc(data) {
    data.map( (deletedObject) => {
      const confirmation = {
        code: 'delete',
        title: 'Delete This Bloc ?',
        description: 'Are you sure to delete this Bloc?',
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .subscribe(
          (res) => {
            if (res === true) {
              this.testService.deleteQuestionBloc(deletedObject['_id']).subscribe(() => {
                this.getTableData().then((dataTable) => {
                  this.tableData.next(dataTable);
                });

              });
            }
            this.subscriptionModal.unsubscribe();
          }
        );
    });

  }
}
