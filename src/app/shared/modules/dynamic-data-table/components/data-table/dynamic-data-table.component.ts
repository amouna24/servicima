import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { DataTableConfigComponent } from '@shared/modules/dynamic-data-table/components/data-table-config/data-table-config.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { Router } from '@angular/router';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import * as _ from 'lodash';
import { IConfig } from '@shared/models/configDataTable.model';
import { IDataListModel  } from '@shared/models/dataList.model';

@Component({
  selector: 'wid-dynamic-data-table',
  templateUrl: './dynamic-data-table.component.html',
  styleUrls: ['./dynamic-data-table.component.scss']
})
export class DynamicDataTableComponent implements OnInit, OnDestroy {

  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() tableCode: string;
  @Input() header: { title: string, addActionURL: string, addActionText: string, type: string,
    addActionDialog: { modalName: string, modalComponent: string, data: object, width: string, height: string } };
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  @Input() allowedActions: { update: boolean, delete: boolean, show: boolean };

  @Output() rowActionData = new EventEmitter<{ actionType: string, data: any}>();

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  modalConfiguration: object[];
  displayedColumns: IConfig[]  = [];
  canBeDisplayedColumns: IConfig[] = [];
  canBeFilteredColumns: IConfig[] = [];
  columns: IConfig[] = [];
  temp: object[] = [];
  columnsList: string[] = [];
  newConfig: IDataListModel[] =  [];
  dataSource: any;
  refData: { } = { };
  constructor(
    private dynamicDataTableService: DynamicDataTableService,
    private modalService: ModalService,
    private utilService: UtilsService,
    private appInitializerService: AppInitializerService,
    private router: Router,
    private modalsServices: ModalService,
    private refDataServices: RefdataService,
    private localStorageService: LocalStorageService,
  ) {
  }

  async ngOnInit() {
    await this.getRefData();
    await this.getDataSource();
    this.getDataList();
  }

   getDataSource() {
     console.log('tablle data=', this.tableData.getValue());
    this.tableData.subscribe((res) => {
      let keys: string;
      this.tableData.getValue().map((data) => {
        const keyAndValueList = Object.entries(data);
        keyAndValueList.map((keyAndValue) => {
          keys = keyAndValue[0];
          keyAndValue.map((value) => {
            if (typeof (value) === 'object' && value) {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < Object.keys(value).length; i++) {
                this.tableData.getValue().map((elm) => {
                  elm[Object.keys(value)[i]] = elm[keys][Object.keys(value)[i]];
                });
              }
            }
          });
        });
      });
      this.dataSource = res;
     this.convertData();
    });
  }

  /**************************************************************************
 * @description get data list
 *************************************************************************/
  getDataList() {
    this.temp = [...this.tableData.getValue()];
    this.modalService.registerModals(
      { modalName: 'dynamicTableConfig', modalComponent: DataTableConfigComponent });
      if (this.localStorageService.getItem(this.tableCode)) {
        this.getConfigDatatable();
      } else {
    this.dynamicDataTableService.getDefaultTableConfig(this.tableCode)
      .subscribe(
        res => {
          this.modalConfiguration = res;
          this.displayedColumns = this.dynamicDataTableService.getDefaultDisplayedColumns(this.modalConfiguration);
          this.canBeDisplayedColumns = this.dynamicDataTableService.generateColumns(
            this.dynamicDataTableService.getCanBeDisplayedColumns(this.modalConfiguration)
          );
          this.canBeFilteredColumns = this.dynamicDataTableService.generateColumns(
            this.dynamicDataTableService.getCanBeFiltredColumns(this.modalConfiguration)
          );
          this.columns = [{ prop: 'rowItem',  name: '', type: 'rowItem'}, ...this.dynamicDataTableService.generateColumns(this.displayedColumns)];
          this.columns.push({ prop: 'Actions',  name: 'Actions', type: 'Actions' });
          this.columnsList = ['rowItem', ...this.dynamicDataTableService.generateColumnsList(this.displayedColumns)];
          this.columnsList.push('Actions');
          this.localStorageService.setItem(this.tableCode,
            { columns: this.columns, columnsList: this.columnsList, modalConfiguration: this.modalConfiguration, actualColumn: this.columns });
        }
      );
      }

  }

  /**************************************************************************
 * @description display table config
 *************************************************************************/
  displayTableConfig() {
    this.newConfig = [];
    this.getConfigDatatable();
    const data = {
      displayedColumns: this.dynamicDataTableService.generateColumns(this.displayedColumns),
      canBeDisplayedColumns: this.canBeDisplayedColumns,
      actualColumns: this.columns,
      columnsList: this.columnsList,
      tableCode: this.tableCode
    };
    this.modalService.displayModal('dynamicTableConfig', data, '40%').subscribe(
      (res) => {
        if (res.action === 'change') {
          this.columns = [{ prop: 'rowItem',  name: '', type: 'rowItem'}, ...res.actualColumns];
          this.columns.push({ prop: 'Actions',  name: 'Actions', type: 'Actions' });
          this.columnsList = ['rowItem', ...res.columnsList];
          this.columnsList.push('Actions');
          const getConfigTableFromLocalStorage = this.localStorageService.getItem(this.tableCode);
          const listTable = getConfigTableFromLocalStorage.modalConfiguration;
          Object.values(listTable)
            .map((list: IDataListModel) => {
              if (this.columnsList.includes(list['dataListKey'].column_code)) {
                list['displayed'] = 'Y';
                list['colum_disp_index'] = res.newDisplayedColumns.find((result) => result.prop === list['dataListKey'].column_code ).index;
                this.newConfig.push(list);
              } else if (list['can_be_displayed'] === 'Y') {
                list['displayed'] = 'N';
                list['colum_disp_index'] = res.newCanBeDisplayedColumns.find((result) => result.prop === list['dataListKey'].column_code ).index;
                this.newConfig.push(list);
              }
            });
            this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');
            this.newConfig  = _.sortBy(this.newConfig , 'colum_disp_index');
            this.localStorageService.setItem(this.tableCode,
              { columns: this.columns, columnsList: this.columnsList, modalConfiguration: this.newConfig , actualColumn: this.columns});
        }
      });
  }

  identify(index, item) {
    return item._id;
  }

  actionRowData(action: string, rowData: any) {
    this.rowActionData.emit({ actionType: action, data: rowData});
  }

  /**************************************************************************
   * @description redirect to page or dialog
   *************************************************************************/
  redirectToPageOrDialog(type: string) {
    if (type === 'dialog') {
      this.modalsServices.displayModal(this.header.addActionDialog.modalName, this.header.addActionDialog.data,
        this.header.addActionDialog.width, this.header.addActionDialog.height).subscribe((data) => {
        if (data) {
          this.tableData.next(data);
        }
      });
    } else {
      this.router.navigate([ this.header.addActionURL ], { state: { action: 'add' } });
    }

  }

  /**************************************************************************
   * @description get refData
   *************************************************************************/
  async getRefData() {
  this.refData =  await this.refDataServices.getRefData(
      this.utilService.getCompanyId(
        this.localStorageService.getItem('userCredentials')['email_address'], this.localStorageService.getItem('userCredentials')['application_id']),
      this.localStorageService.getItem('userCredentials')['application_id'],
      ['LEGAL_FORM', 'CONTRACT_STATUS', 'GENDER', 'PROF_TITLES', 'PAYMENT_MODE', 'PROFILE_TYPE'],
    false
    );
  }

  /**************************************************************************
   * @description get config datatable
   *************************************************************************/
   getConfigDatatable() {
    const getConfigTableFromLocalStorage = this.localStorageService.getItem(this.tableCode);
    this.columns = getConfigTableFromLocalStorage.columns ? getConfigTableFromLocalStorage.columns : this.columns;
    this.columnsList = getConfigTableFromLocalStorage.columnsList ? getConfigTableFromLocalStorage.columnsList : this.columnsList;
    const newModalConfig = getConfigTableFromLocalStorage.modalConfiguration
      ? getConfigTableFromLocalStorage.modalConfiguration : this.modalConfiguration;
    this.displayedColumns = this.dynamicDataTableService.getDefaultDisplayedColumns(newModalConfig);
    this.canBeDisplayedColumns = this.dynamicDataTableService.generateColumns(
      this.dynamicDataTableService.getCanBeDisplayedColumns(newModalConfig)
    );
    this.canBeFilteredColumns = this.dynamicDataTableService.generateColumns(
      this.dynamicDataTableService.getCanBeFiltredColumns(newModalConfig)
    );

  }

 /**************************************************************************
 * @description display description
 *************************************************************************/
  convertData() {
    this.dataSource.map((dataS) => {
      if (dataS.application_id) {
        dataS['application_id'] = this.utilService.getApplicationName(dataS.application_id);
      }
      /*** ***********************       APP INITIALIZER        *********************** ***/
      if (dataS.language_id) {
        dataS['language_id'] = this.appInitializerService.languageList.find((type) =>
          type._id === dataS['language_id'])?.language_desc;
      }
      if (dataS.company_id) {
        dataS['company_id'] = this.utilService.companiesList.find((type) =>
          type._id === dataS['company_id'])?.company_name;
      }
      if (dataS.language) {
        dataS['language'] = this.appInitializerService.languageList.find((type) =>
          type.LanguageKey.language_code === dataS['language'])?.language_desc;
      }
      if (dataS.activity_sector) {
        dataS['activity_sector'] = this.appInitializerService.activityCodeList.find((type) =>
          type.NAF === dataS['activity_sector'])?.ACTIVITE;
      }
      if (dataS.currency_cd) {
        dataS['currency_cd'] = this.appInitializerService.currenciesList.find((type) =>
          type.CURRENCY_CODE === dataS['currency_cd'])?.CURRENCY_DESC;
      }
      /*** ***********************           REF DATA           *********************** ***/
      if (dataS.payment_cd) {
        dataS['payment_cd'] = this.refData['PAYMENT_MODE'].find((type) =>
          type.value === dataS['payment_cd'])?.viewValue;
      }
      if (dataS.gender_cd) {
        dataS['gender_cd'] = this.refData['GENDER'].find((type) =>
          type.value === dataS['gender_cd'])?.viewValue;
      }
      if (dataS.contract_status) {
        dataS['contract_status'] = this.refData['CONTRACT_STATUS'].find((type) =>
          type.value === dataS['contract_status'])?.viewValue;
      }
      if (dataS.legal_form) {
        dataS['legal_form'] = this.refData['LEGAL_FORM'].find((type) =>
          type.value === dataS['legal_form'])?.viewValue;
      }
      if (dataS.title_cd) {
        dataS['title_cd'] = this.refData['PROF_TITLES'].find((type) =>
          type.value === dataS['title_cd'])?.viewValue;
      }
      if (dataS.user_type) {
        dataS['user_type'] = this.refData['PROFILE_TYPE'].find((type) =>
          type.value === dataS['user_type'])?.viewValue;
      }
    });
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
