import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { ColumnMode, SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalService } from '@core/services/modal/modal.service';

import { DataTableService } from '../../services/data-table.service';
import { ConfigurationModalComponent } from '../configuration-modal/configuration-modal.component';

@Component({
  selector: 'wid-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input() data: any[] = [];
  @Input() tableCode: string;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected = [];
  columns = [];
  temp = [];
  modalConfiguration: any;
  displayedColumns = [];
  canBeDisplayedColumns = [];
  canBeFiltredColumns = [];
  searchSelection = {
    name: ''
  };

  constructor(private dataTableService: DataTableService, private modalService: ModalService) { }

  ngOnChanges(changes): void {
  }

  ngOnInit(): void {
    this.temp = [...this.data];
    this.modalService.registerModals([
      { modalName: 'dataTableConfiguration', modalComponent: ConfigurationModalComponent }]);
    this.dataTableService.getDefaultTableConfig(this.tableCode).subscribe(
      res => {
        this.modalConfiguration = res;
        this.displayedColumns = this.dataTableService.getDefaultDisplayedColumns(this.modalConfiguration);
        this.canBeDisplayedColumns = this.dataTableService.generateColumns(this.dataTableService.getCanBeDisplayedColumns(this.modalConfiguration));
        this.canBeFiltredColumns = this.dataTableService.generateColumns(this.dataTableService.getCanBeFiltredColumns(this.modalConfiguration));
        this.columns = this.dataTableService.generateColumns(this.displayedColumns);
      }
    );
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  updateFilter(event, searchSelection) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter((row) => {
      return row[searchSelection.prop].toLowerCase().indexOf(val) !== -1 || !val;
    });
    console.log(temp);
    // update the rows
    this.data = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  displayConfigModal() {
    const data = {
      displayedColumns: this.dataTableService.generateColumns(this.displayedColumns),
      canBeDisplayedColumns: this.canBeDisplayedColumns,
      actualColumns: this.columns
    };
    this.modalService.displayModal('dataTableConfiguration', data, '40%').subscribe(
      (res) => {
        if (res.action === 'change') {
          this.columns = [...res.actualColumns];
        }
      }
    );
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  onCheckboxChangeFn($event) {
  }

}
