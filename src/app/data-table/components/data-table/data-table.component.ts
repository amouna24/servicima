import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
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

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected = [];
  columns = [];
  modalConfiguration: any;
  displayedColumns = [];
  canBeDisplayedColumns = [];
  canBeFiltredColumns = [];

  constructor(private dataTableService: DataTableService, private modalService: ModalService) { }

  ngOnChanges(changes): void {
    console.log('change', changes);
  }

  ngOnInit(): void {
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
    console.log('Select Event', this.selected);
  }

  displayConfigModal() {

    const data = { displayedColumns: this.columns, canBeDisplayedColumns: this.canBeDisplayedColumns };
    this.modalService.displayModal('dataTableConfiguration', data, '400px').subscribe(
      (res) => {
        console.log(res);
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
    console.log($event);
  }

}
