import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { ConfigurationModalComponent } from '@dataTable/components/configuration-modal/configuration-modal.component';
import { DataTableConfigComponent } from '@shared/modules/dynamic-data-table/components/data-table-config/data-table-config.component';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'wid-dynamic-data-table',
  templateUrl: './dynamic-data-table.component.html',
  styleUrls: ['./dynamic-data-table.component.scss']
})
export class DynamicDataTableComponent implements OnInit {

  @Input() tableData: any[] = [];
  @Input() tableCode: string;
  @Input() header: { title: string, addActionURL: string, addActionText: string};

  @Output() rowID = new EventEmitter<string>();
  @Output() rowData = new EventEmitter<any>();

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
  ) { }

  ngOnInit(): void {
    this.temp = [...this.tableData];
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
        this.dataSource = this.tableData;
        this.displayTableConfig();
        console.log('columns', this.columns);
        console.log('list', this.columnsList);
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
          console.log('columns',  this.columns);
          console.log('columnsList',  this.columnsList);

        }
      }
    );
  }

  identify(index, item) {
    console.log('index', index);
    console.log('item', item);
    return item._id;
  }

  updateOrDelete(id: string) {
    this.rowID.emit(id);
  }

  showRowData(rowData: any) {
    this.rowData.emit(rowData);
  }
}
