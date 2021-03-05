import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { ConfigurationModalComponent } from '@dataTable/components/configuration-modal/configuration-modal.component';
import { DataTableConfigComponent } from '@shared/modules/dynamic-data-table/components/data-table-config/data-table-config.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';

@Component({
  selector: 'wid-dynamic-data-table',
  templateUrl: './dynamic-data-table.component.html',
  styleUrls: ['./dynamic-data-table.component.scss']
})
export class DynamicDataTableComponent implements OnInit {

  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() tableCode: string;
  @Input() header: { title: string, addActionURL: string, addActionText: string};
  @Input() isLoading = new BehaviorSubject<boolean>(false);

  @Output() rowActionData = new EventEmitter<{ actionType: string, data: any}>();

  modalConfiguration: any;
  displayedColumns = [];
  canBeDisplayedColumns = [];
  canBeFilteredColumns = [];
  columns = [];
  temp = [];
  columnsList = [];
  dataSource: any;

  constructor(
    private dynamicDataTableService: DynamicDataTableService,
    private modalService: ModalService,
    private utilService: UtilsService,
    private appInitializerService: AppInitializerService,
  ) { }

  ngOnInit(): void {
    this.getDataSource();
    this.getDataList();
  }

  getDataSource() {
    this.tableData.subscribe((res) => {
      let keys;
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
      this.dataSource.map((dataS) => {
        if (dataS.application_id) {
          dataS['application_id'] = this.utilService.getApplicationName(dataS.application_id);
        }
        if (dataS.language_id) {
          dataS['language_id'] = this.appInitializerService.languageList.find((type) =>
            type._id === dataS['language_id']).language_desc;
        }
      });
    });
  }

  getDataList() {
    this.temp = [...this.tableData.getValue()];
    this.modalService.registerModals(
      { modalName: 'dynamicTableConfig', modalComponent: DataTableConfigComponent });
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
          this.displayTableConfig();
        }
      );

  }
  displayTableConfig() {
    const data = {
      displayedColumns: this.dynamicDataTableService.generateColumns(this.displayedColumns),
      canBeDisplayedColumns: this.canBeDisplayedColumns,
      actualColumns: this.columns,
      columnsList: this.columnsList,
    };
    this.modalService.displayModal('dynamicTableConfig', data, '40%').subscribe(
      (res) => {
        if (res.action === 'change') {
          this.columns = [{ prop: 'rowItem',  name: '', type: 'rowItem'}, ...res.actualColumns];
          this.columns.push({ prop: 'Actions',  name: 'Actions', type: 'Actions' });

          this.columnsList = ['rowItem', ...res.columnsList];
          this.columnsList.push('Actions');
        }
      }
    );
  }

  identify(index, item) {
    return item._id;
  }

  actionRowData(action: string, rowData: any) {
    this.rowActionData.emit({ actionType: action, data: rowData});
  }
}
