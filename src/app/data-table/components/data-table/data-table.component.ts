import { Component, OnInit, Input } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ModalService } from '@core/services/modal/modal.service';

import { DataTableService } from '../../services/data-table.service';
import { ConfigurationModalComponent } from '../configuration-modal/configuration-modal.component';

@Component({
  selector: 'wid-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() tableCode: string;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected = [];
  modalConfiguration: any;

  constructor(private dataTableService: DataTableService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.registerModals([
      { modalName: 'dataTableConfiguration', modalComponent: ConfigurationModalComponent }]);
    this.dataTableService.getDefaultTableConfig(this.tableCode).subscribe(
      res => {
        this.modalConfiguration = res;
        const displayedColumns = this.dataTableService.getDefaultDisplayedColumn(this.modalConfiguration);
        console.log(this.dataTableService.generateColumns(displayedColumns));
      }
    );
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    console.log('Select Event', this.selected);
  }

  displayConfigModal() {
    //  this.columns.push({ name: 'weight' });
    this.modalService.displayModal('dataTableConfiguration', this.modalConfiguration);
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

  detailToggle($event) {
    console.log($event);
  }

}
