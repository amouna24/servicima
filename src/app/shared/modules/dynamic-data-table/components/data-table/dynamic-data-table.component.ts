import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
import { IDataListModel } from '@shared/models/dataList.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dataAppearance } from '@shared/animations/animations';
import { UserService } from '@core/services/user/user.service';

import { environment } from '@environment/environment';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'wid-dynamic-data-table',
  templateUrl: './dynamic-data-table.component.html',
  styleUrls: ['./dynamic-data-table.component.scss'],
  animations: [
    dataAppearance
  ]
})
export class DynamicDataTableComponent implements OnInit, AfterViewChecked, OnDestroy {

  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() colorObject: object[];
  @Input() tableCode: string;
  @Input() header: {
    title: string, addActionURL?: string, addActionText?: string,
    type?: string,
    addActionDialog?:
      { modalName: string, modalComponent: string, data: object, width: string, height: string }
  };
  @Input() security: boolean;
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  @Input() allowedActions: string[];
  @Input() buttonAdd: boolean;
  @Input() setAvatar: { columnCode: string, imgSrc: string};
  @Output() rowActionData = new EventEmitter<{ actionType: string, data: any }>();
  @Output() pagination = new EventEmitter<{ limit: number, offset: number, search?: any, searchBoolean?: boolean }>();
  @Output() checked = new EventEmitter<{ }>();
  @Output() changeStatus = new EventEmitter<{ }>();
  @Output() search = new EventEmitter<{ }>();
  @Output() filter = new EventEmitter<{ }>();
  @ViewChild('closePanel')
  closePanel: any;
  /**************************************************************************
   * @description Paginations
   *************************************************************************/
  itemsPerPage = [5, 10, 25, 100];
  itemsPerPageControl = new FormControl(5);
  totalItems: number;
  searchBoolean = false;
  countedItems = 0;
  totalCountedItems = null;
  offset: number;
  limit: number;
  nbrPages: number[];
  currentPage = 1;
  listChecked = [];
  selectedAll = false;
  indeterminate: boolean;
  panelOpenState = false;
  env = environment.uploadFileApiUrl + '/image/';
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  modalConfiguration: object[];
  displayedColumns: IConfig[] = [];
  canBeDisplayedColumns: IConfig[] = [];
  canBeFilteredColumns: IConfig[] = [];
  columns: IConfig[] = [];
  form: FormGroup;
  selections = [];
  operator: string[];
  keyColumnDesc: string;
  temp: object[] = [];
  columnsList: string[] = [];
  newConfig: IDataListModel[] = [];
  dataSource: any;
  refData: { } = { };
  showAllText: boolean;
  languageCode: string;
  companyEmail: string;
  languageId: string;
  status = 'DISABLED';
  columnStatus: string[] = [];
  defaultRes: any;
  searchT: { columns: string, filterValue: string, operator: string, defaultValue: string };
  andOr: string[] = [];
  viewColumns = [];
  constructor(
    private dynamicDataTableService: DynamicDataTableService,
    private modalService: ModalService,
    private utilService: UtilsService,
    private appInitializerService: AppInitializerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalsServices: ModalService,
    private refDataServices: RefdataService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
  }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      input: this.formBuilder.array([])
    });
  }

  /**
   * @description  add role name with translate
   */
  onAddAnotherFilter() {
    return this.getListFilter().push(this.formBuilder.group({
      column: ['', [Validators.required]],
      valueFilter: ['', [Validators.required]],
      type: ['', [Validators.required]],
      operator: ['', [Validators.required]],
      filterType: [''],
    }));
  }

  /**
   * @description  get list array input
   */
  getListFilter() {
    return this.form.get('input') as FormArray;
  }

  /**
   * @description : Get column to filtered
   */
  getColumnToFiltered() {
    const modelConfig = this.localStorageService.getItem(this.tableCode) ?
      this.localStorageService.getItem(this.tableCode).modalConfiguration : this.modalConfiguration;
    const canBeFiltered = modelConfig.filter((data) => {
      return data.can_be_filtred === 'Y';
    });
    const listColumnCode = [];
    canBeFiltered.map((data) => {
      listColumnCode.push(data.dataListKey.column_code);
    });
    this.viewColumns = this.columns.filter((data) => {
      if (listColumnCode.includes((data.prop))) {
        return data;
      }
    });
  }

  /**
   * @description  Delete filter
   */
  delete(index: number) {
    this.andOr.splice(index, 1);
    this.getListFilter().removeAt(index);
    this.tableData.next(this.defaultRes);
    this.pagination.emit({ limit: this.itemsPerPageControl.value, offset: 0, search: ''});
    this.currentPage = this.nbrPages[0];
    this.searchT = null;
  }

  /**
   * @description  test is date is valid or not
   */
  isValidDate(date) {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
  }

  /**
   * @description : selected select
   */
  selected(type: string, index: number) {
    this.searchT = null;
    this.selections = [];
    this.keyColumnDesc = '';
    const formArr = this.form.controls['input'] as FormArray;
    this.tableData.next(this.defaultRes);
    formArr.controls[index].patchValue({ valueFilter: '' });
    const column = this.localStorageService.getItem(this.tableCode).columns.find(value => value.name === type);
    if (column.type === 'selection') {
      this.operator = ['is'];
      this.switchColumn(column.prop);
      this.form.value.input[index].type = 'selection';
      formArr.controls[index].patchValue({ type: 'selection' });
      formArr.controls[index].patchValue({ operator: 'is' });
    } else {
      if (this.defaultRes['results']) {
        formArr.controls[index].patchValue({ type: column.type });
        if (typeof (this.defaultRes['results'][0][column.prop]) === 'number') {
          this.operator = ['>', '<', '='];
        } else if (typeof (this.defaultRes['results'][0][column.prop]) === 'string'
          && this.isValidDate(new Date(this.defaultRes['results'][0][column.prop]))) {
          this.operator = ['equal', 'before', 'after'];
        } else if (typeof (this.defaultRes['results'][0][column.prop]) === 'string') {
          this.operator = ['is', 'includes'];
        } else {
          this.operator = ['is', 'includes'];
        }
      }
    }
  }

  /**
   * @description : attribute column to selection
   * @param column: column code
   */
  switchColumn(column: string) {
    switch (column) {
      case 'language_id':
        this.selections = this.appInitializerService.languageList;
        this.keyColumnDesc = 'language_desc';
        return '_id';
      case 'user_type':
        this.selections = this.refData['PROFILE_TYPE'];
        this.keyColumnDesc = 'viewValue';
        return 'value';
      case 'gender_id':
        this.selections = this.refData['GENDER'];
        this.keyColumnDesc = 'viewValue';
        return 'value';
      case 'application_id':
        this.selections = this.appInitializerService.applicationList;
        this.keyColumnDesc = 'application_desc';
        return '';
      case 'activity_sector':
        this.selections = this.appInitializerService.activityCodeList;
        this.keyColumnDesc = 'ACTIVITE';
        return 'activity_sector';
      case 'currency_cd':
        this.selections = this.appInitializerService.currenciesList;
        this.keyColumnDesc = 'CURRENCY_DESC';
        return 'CURRENCY_CODE';
      case 'company_id':
        this.selections = this.utilService.companiesList;
        this.keyColumnDesc = 'company_name';
        return '_id';
      case 'status':
        this.selections = ['ACTIVE', 'DISABLED'];
        return '';
      case 'invoice_status':
        this.selections = ['PENDING', 'Draft', 'Sent'];
        return '';
    }
  }

  /**
   * @description : attribute column to selection
   * @param event: event
   * @param listData: list data
   * @param existingData: existing data
   * @param replacedData: replaced data
   * @param column: column code
   * @param listProps: list props
   */
  findData(event, listData: object[], existingData: string, replacedData: string, column: string, listProps: string[]) {
    if (listProps.includes(column)) {
      const fil = listData.find((type) =>
        type[existingData].toLowerCase() === event.target.value.toLowerCase()) ? listData.find((type) =>
        type[existingData].toLowerCase() === event.target.value.toLowerCase())?.[replacedData] : '';
      return fil ? { 'column': column, value: fil } : '';
    }
    return '';
  }

  /**
   * @description : search data
   * @param event: event
   */
  searchData(event) {
    this.currentPage = this.nbrPages ?  this.nbrPages[0] : 1;
    this.searchBoolean = true;
    const listProps = this.canBeFilteredColumns.map((filtered) => {
      return filtered.prop;
    });

    const res = this.findData(event, this.appInitializerService.languageList, 'language_desc', '_id', 'language_id', listProps);
    const res1 = this.findData(event, this.refData['PROFILE_TYPE'], 'viewValue', 'value', 'user_type', listProps);
    const res2 = this.findData(event, this.refData['GENDER'], 'viewValue', 'value', 'gender_id', listProps);

    const total = [res, res1, res2];

    const mapValue = total.filter((data) => {
      if (data) {
        return data;
      }
    });
    this.search.emit({ value: { value1: event.target.value, value2: mapValue[0] ? mapValue[0]
          : { 'column': '', value: '' } }, listColumns: listProps},  );
  }

  async ngOnInit() {
    this.initForm();
    await this.connectedUser();
    await this.getRefData();
    this.getDataSource();
    this.getDataList();
    this.itemsPerPageControl.valueChanges
      .subscribe(
        () => {
          this.pagination.emit({ limit: this.itemsPerPageControl.value, offset: 0,  search: this.searchT,   searchBoolean: this.searchBoolean});
          this.currentPage = this.nbrPages[0];
        },
      );
    this.showAllText = false;
  }

  getDataSource() {
    this.tableData.subscribe((res) => {
      this.totalItems = res?.total ? res.total : null;
      this.countedItems = res?.count ? res.total : null;
      this.offset = res?.offset ? Number(res?.offset) + 1 : null;
      this.limit = res?.limit ? Number(res?.limit) : null;
      this.totalCountedItems = res?.count ? res?.count === this.itemsPerPageControl.value ?
        this.currentPage * this.itemsPerPageControl.value :
        (this.currentPage - 1) * this.itemsPerPageControl.value + res['count'] : null;
      this.nbrPages = res?.total ? Array(Math.ceil(Number(res['total']) / this.itemsPerPageControl.value))
        .fill(null)
        .map((x, i) => i + 1) : null;
      let keys: string;
      const dataList = res?.results ? res?.results : res;
      Object.values(dataList).map((data) => {
        const keyAndValueList = Object.entries(data);
        keyAndValueList.map((keyAndValue) => {
          keys = keyAndValue[0];
          keyAndValue.map((value) => {
            if (typeof (value) === 'object' && value) {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < Object.keys(value).length; i++) {
                Object.values(dataList).map((elm) => {
                  elm[Object.keys(value)[i]] = elm[keys][Object.keys(value)[i]];
                });
              }
            }
          });
        });
      });
      this.dataSource = dataList;
      this.convertData();
    });
    this.defaultRes = { ...this.tableData.getValue() };
  }

  /**************************************************************************
   * @description Find column by code and get your description
   * @param columns: columns
   * @param res: res
   *************************************************************************/
  findColumnDescription(columns, res) {
    columns.map((element) => {
      if (element.prop !== 'rowItem' || element.prop !== 'rowItem1') {
        element['name'] = res.find((type) =>
          type.dataListKey.column_code === element['prop'])?.column_desc;
      }
    });
  }

  /**************************************************************************
   * @description get data list
   *************************************************************************/
  getDataList() {
    this.languageCode = this.localStorageService.getItem('language').langCode;
    this.languageId = this.localStorageService.getItem('language').langId;
    this.temp = this.tableData?.getValue()['results'] ? [...this.tableData?.getValue()['results']] :
      [...this.tableData?.getValue()];
    this.modalService.registerModals(
      { modalName: 'dynamicTableConfig', modalComponent: DataTableConfigComponent});
    if (this.localStorageService.getItem(this.tableCode)) {
      if (this.localStorageService.getItem(this.tableCode).languageCode === this.languageCode) {
        this.getConfigDatatable();
        this.getColumnToFiltered();
      } else {
        this.dynamicDataTableService.getDefaultTableConfig(this.tableCode, this.languageId)
          .subscribe(
            res => {
              const newConfig = this.localStorageService.getItem(this.tableCode).modalConfiguration;
              newConfig.map((er) => {
                 er['column_desc'] = res.find((type) =>
                  type.dataListKey.column_code === er['dataListKey']['column_code'])?.column_desc;
              });
              const newColumns =  this.localStorageService.getItem(this.tableCode).columns;
              this.findColumnDescription(newColumns, res);
              this.localStorageService.setItem(this.tableCode,
                {
                  columns: newColumns,
                  columnsList: this.localStorageService.getItem(this.tableCode).columnsList,
                  modalConfiguration: newConfig ,
                  languageCode: this.languageCode
                });
              this.getConfigDatatable();
            });

      }

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
            if (this.security) {
              this.columns = [{
                prop: 'rowItem',
                name: '',
                type: 'rowItem'
              }, {
                prop: 'rowItem1',
                name: '',
                type: 'rowItem1'
              }, ...this.dynamicDataTableService.generateColumns(this.displayedColumns)];
              this.columnsList = ['rowItem', 'rowItem1', ...this.dynamicDataTableService.generateColumnsList(this.displayedColumns)];
            } else {
              this.columns = [{
                prop: 'rowItem',
                name: '',
                type: 'rowItem'
              },  ...this.dynamicDataTableService.generateColumns(this.displayedColumns)];
              this.columnsList = ['rowItem', ...this.dynamicDataTableService.generateColumnsList(this.displayedColumns)];
            }

            this.localStorageService.setItem(this.tableCode,
              {
                columns: this.columns,
                columnsList: this.columnsList,
                modalConfiguration: this.modalConfiguration,
                languageCode: this.languageCode
              });
            this.getColumnToFiltered();
          }
        );
    }

  }

  /**************************************************************************
   * @description change color and check row
   * @param color: color of line
   * @param checked: checked or not
   *************************************************************************/
  changeColorAndCheckRow(color: string, checked: boolean) {
    (this.tableData.getValue()?.length ? this.tableData.getValue() : this.tableData.getValue()['results']).map((data) => {
      data['color'] = color;
      data['checked'] = checked;
    });
  }

  /**************************************************************************
   * @description change status
   * @param status: status
   *************************************************************************/
  showWithStatus(status: string) {
    this.changeStatus.emit(status);
    if (this.status === 'ACTIVE') {
      this.status = 'DISABLED';
    } else {
      this.status = 'ACTIVE';
    }
    const newData =  Object.values(this.defaultRes).filter((data) => {
     return data['status'] === status;
   });
  this.tableData.next(newData);
  }

  /**
   * @description  Apply filter
   * @param filterValue: value of filter
   * @param searchSelection: search selection
   */
  applyFilter(filterValue: string,
              searchSelection: { column: string, filterType: string, operator: string, type: string, valueFilter: string }) {
    const columnCode = this.localStorageService.getItem(this.tableCode).columns.find((data) => data.name === searchSelection.column).prop;
    const filter = this.switchColumn(columnCode) ? filterValue[this.switchColumn(columnCode)] : filterValue;
    this.searchT = {
      columns: columnCode,
      filterValue: filter,
      operator: '',
      defaultValue: filter,
    };
  }

  /**
   * @description : execute filter
   */
  run(): void {
    this.currentPage = this.nbrPages ? this.nbrPages[0] : 1;
    this.searchT.operator = this.form.value.input[0]?.operator;
    this.filter.next(this.searchT);
  }

  /**************************************************************************
   * @description select all checkbox
   * @param event: event
   *************************************************************************/
  selectAll(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.listChecked.length === 0) {
        this.listChecked = this.tableData.getValue()?.length ? this.tableData.getValue() : this.tableData.getValue()['results'];
        this.changeColorAndCheckRow('#F3F6F9', true);
        this.checked.emit(this.tableData.getValue()?.length ? this.tableData.getValue() : this.tableData.getValue()['results']);
      } else if (this.listChecked.length < (this.tableData.getValue()?.length ? this.tableData.getValue().length
        : this.tableData.getValue()['results'].length) && this.listChecked.length > 0) {
        this.listChecked = [];
        this.changeColorAndCheckRow('white', false);
        this.checked.emit(this.listChecked);
      }
    } else {
      this.listChecked = [];
      this.changeColorAndCheckRow('white', false);
      this.checked.emit(this.listChecked);
    }
  }

  /**************************************************************************
   * @description open panel
   * @param event: event
   *************************************************************************/
  open(event: MouseEvent) {
    event.stopPropagation();
  }

  /**************************************************************************
   * @description is indeterminate or not checkbox
   *************************************************************************/
  isIndeterminate(): boolean {
    if (JSON.stringify(this.tableData.getValue()) !== '{}') {
    if (this.listChecked.length === (this.tableData.getValue()?.length ? this.tableData.getValue()?.length
      : this.tableData.getValue()?.results?.length)) {
      this.selectedAll = true;
      return this.indeterminate = false;
    } else if (this.listChecked.length > 0 && this.listChecked.length < (this.tableData.getValue()?.length ? this.tableData.getValue()?.length
      : this.tableData.getValue()?.results?.length)) {
      this.selectedAll = false;
      return this.indeterminate = true;
    } else {
      this.selectedAll = false;
      return this.indeterminate = false;
    }
  }
  }

  /**************************************************************************
   * @description checked checkbox
   * @param rowData: row selected
   * @param event: event
   *************************************************************************/
  getChecked(rowData: string[], event: MatCheckboxChange) {
    if ( event.checked ) {
      rowData['color'] = '#F3F6F9';
      rowData['checked'] =  event.checked;
      this.listChecked.push(rowData);
      this.checked.emit(this.listChecked);
      if (this.listChecked.length === (this.tableData.getValue()?.length ? this.tableData.getValue().length
        : this.tableData.getValue()['results'].length)) {
        this.selectedAll = true;
      }
    } else {
      rowData['checked'] =  event.checked;
      const filtered = this.listChecked.filter((value) => {
        return value['_id'] !== rowData['_id'];
      });
      this.listChecked = filtered;
      if (filtered.length > 0) {
        rowData['color'] = 'white';
        this.checked.emit(filtered);
      } else {
        rowData['color'] = 'white';
        this.checked.emit(filtered);
      }
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
      columnsList: this.columnsList,
      tableCode: this.tableCode
    };
    this.modalService.displayModal('dynamicTableConfig', data, '50%', '500px').subscribe(
      (res) => {
        if (res.action === 'change') {
          if (this.security) {
            this.columns = [{ prop: 'rowItem', name: '', type: 'rowItem'}, { prop: 'rowItem1', name: '', type: 'rowItem1'}, ...res.actualColumns];
            this.columnsList = ['rowItem', 'rowItem1', ...res.columnsList];
          } else {
            this.columns = [{ prop: 'rowItem', name: '', type: 'rowItem'}, ...res.actualColumns];
            this.columnsList = ['rowItem', ...res.columnsList];
          }
          const getConfigTableFromLocalStorage = this.localStorageService.getItem(this.tableCode);
          const listTable = getConfigTableFromLocalStorage.modalConfiguration;
          Object.values(listTable)
            .map((list: IDataListModel) => {
              if (this.columnsList.includes(list['dataListKey'].column_code)) {
                list['displayed'] = 'Y';
                list['colum_disp_index'] = res.newDisplayedColumns.find((result) => result.prop === list['dataListKey'].column_code).index;
                this.newConfig.push(list);
              } else if (list['can_be_displayed'] === 'Y') {
                list['displayed'] = 'N';
                list['colum_disp_index'] = res.newCanBeDisplayedColumns.find((result) => result.prop === list['dataListKey'].column_code).index;
                this.newConfig.push(list);
              }
            });
          this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');
          this.newConfig = _.sortBy(this.newConfig, 'colum_disp_index');
          this.localStorageService.setItem(this.tableCode,
            {
              columns: this.columns,
              columnsList: this.columnsList,
              modalConfiguration: this.newConfig,
              languageCode: this.languageCode,
            });
        }
        this.getColumnToFiltered();
      });
  }

  identify(index, item) {
    return item._id;
  }

  /**************************************************************************
   * @description action
   * @param action: name of action
   * @param rowData: list of row to do action
   *************************************************************************/
  actionRowData(action: string, rowData: object) {
    this.rowActionData.emit({ actionType: action, data: rowData });
    this.closePanel.close();
    this.listChecked = [];
    this.tableData.getValue()?.length ? this.tableData.getValue() : this.tableData.getValue()['results'].map((data) => {
      data['color'] = 'white';
      data['checked'] = false;
    });
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
      this.router.navigate([this.header.addActionURL], { state: { action: 'add'}});
    }

  }

  /**************************************************************************
   * @description Get connected user
   *************************************************************************/
 async connectedUser() {
    return new Promise((resolve) => {
      this.userService.connectedUser$.subscribe(
        async (data) => {
         this.companyEmail = data?.user[0]['company_email'];
         resolve(this.companyEmail);
        });
    });

  }

  /**************************************************************************
   * @description get refData
   *************************************************************************/
  async getRefData() {
    this.refData = await this.refDataServices.getRefData(
        this.utilService.getCompanyId(
            this.companyEmail, this.localStorageService.getItem('userCredentials')['application_id']),
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
    console.log(Object.values(this.dataSource), 'data source');
    Object.values(this.dataSource).map((dataS) => {
      if (dataS['application_id']) {
        dataS['application_id'] = this.utilService.getApplicationName(dataS['application_id']);
      }
      /*** ***********************       APP INITIALIZER        *********************** ***/
      if (dataS['language_id']) {
        dataS['language_id'] = this.appInitializerService.languageList.find((type) =>
          type._id === dataS['language_id'])?.language_desc ? this.appInitializerService.languageList.find((type) =>
            type._id === dataS['language_id'])?.language_desc : dataS['language_id'];
      }
      if (dataS['company_id']) {
        dataS['company_id'] = this.utilService.companiesList.find((type) =>
          type._id === dataS['company_id'])?.company_name;
      }
      if (dataS['language']) {
        dataS['language'] = this.appInitializerService.languageList.find((type) =>
          type.LanguageKey.language_code === dataS['language'])?.language_desc;
      }
      if (dataS['activity_sector']) {
        dataS['activity_sector'] = this.appInitializerService.activityCodeList.find((type) =>
          type.NAF === dataS['activity_sector'])?.ACTIVITE;
      }
      if (dataS['currency_cd']) {
        dataS['currency_cd'] = this.appInitializerService.currenciesList.find((type) =>
          type.CURRENCY_CODE === dataS['currency_cd'])?.CURRENCY_DESC;
      }
      /*** ***********************           REF DATA           *********************** ***/
      if (dataS['payment_cd']) {
        dataS['payment_cd'] = this.refData['PAYMENT_MODE'].find((type) =>
          type.value === dataS['payment_cd'])?.viewValue;
      }
      if (dataS['gender_cd']) {
        dataS['gender_cd'] = this.refData['GENDER'].find((type) =>
          type.value === dataS['gender_cd'])?.viewValue;
      }
      if (dataS['gender_id']) {
        dataS['gender_id'] = this.refData['GENDER'].find((type) =>
          type.value === dataS['gender_id']) ? this.refData['GENDER'].find((type) =>
            type.value === dataS['gender_id'])?.viewValue : dataS['gender_id'];
      }
      if (dataS['contract_status']) {
        dataS['contract_status'] = this.refData['CONTRACT_STATUS'].find((type) =>
          type.value === dataS['contract_status'])?.viewValue;
      }
      if (dataS['legal_form']) {
        dataS['legal_form'] = this.refData['LEGAL_FORM'].find((type) =>
          type.value === dataS['legal_form'])?.viewValue;
      }
      if (dataS['title_cd']) {
        dataS['title_cd'] = this.refData['PROF_TITLES'].find((type) =>
          type.value === dataS['title_cd'])?.viewValue;
      }
      if (dataS['user_type']) {
        dataS['user_type'] = this.refData['PROFILE_TYPE'].find((type) =>
          type.value === dataS['user_type']) ? this.refData['PROFILE_TYPE'].find((type) =>
          type.value === dataS['user_type'])?.viewValue : dataS['user_type'];
      }
    });
  }

  /**************************************************************************
   * @description Get next, previous or specific page
   * @params type : next / previous / specific
   * @params pageNumber : number of specific page
   *************************************************************************/
  getItemsPerPage(type: string, pageNumber?: number) {
    switch (type) {
      case 'first-page' : {
        this.pagination.emit({ limit: this.itemsPerPageControl.value, offset: 0,  search: this.searchT,   searchBoolean: this.searchBoolean});
        this.currentPage = this.nbrPages[0];
      }
        break;
      case 'previous-page' : {
        this.pagination.emit({
          limit: this.itemsPerPageControl.value,
          offset: this.offset - 1 - this.itemsPerPageControl.value,
          search: this.searchT,
          searchBoolean: this.searchBoolean
        });
        this.currentPage -= 1;

      }
        break;
      case 'specific-page' : {
        this.currentPage = pageNumber;
        this.pagination.emit({
          limit: this.itemsPerPageControl.value,
          offset: this.itemsPerPageControl.value * (pageNumber - 1),
          search: this.searchT,
          searchBoolean: this.searchBoolean
        });
      }
        break;
      case 'next-page' : {
        this.pagination.emit({
          limit: this.itemsPerPageControl.value,
          offset: this.offset - 1 + this.itemsPerPageControl.value,
          search: this.searchT,
          searchBoolean: this.searchBoolean
        });
        this.currentPage += 1;
      }
        break;
      case 'last-page' : {
        this.pagination.emit({
          limit: this.itemsPerPageControl.value,
          offset: (this.itemsPerPageControl.value * (this.nbrPages.length - 1)),
          search: this.searchT,
          searchBoolean: this.searchBoolean
        });
        this.currentPage = this.nbrPages[this.nbrPages.length - 1];
      }
        break;
    }
  }

  sendColors(columns, condValue): string {
    let cellColor = 'black';
    this.colorObject.map ( (oneColumn) => {
      if ( columns === oneColumn['columnCode']) {
        oneColumn['condValue'].forEach( (Condition, index) => {
          if (condValue === Condition) {
            cellColor = oneColumn['color'][index];
          }
        });
      }
    });
      return cellColor;
  }

  /**************************************************************************
   * @description Add avatar to column
   *************************************************************************/
  showAvatar(col, rowVal?) {
    let imgSrc = null;
    const haveImg = !!this.setAvatar && this.setAvatar.columnCode === col;
    if (haveImg) {
      if (!!rowVal && rowVal[this.setAvatar.imgSrc]) {
        imgSrc = this.env + rowVal[this.setAvatar.imgSrc];
      }
    } else {
        imgSrc = 'assets/img/default.jpg';
      }
    return { haveImg, imgSrc};
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
