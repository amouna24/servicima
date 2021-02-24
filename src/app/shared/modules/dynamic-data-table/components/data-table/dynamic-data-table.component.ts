import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDataTableService } from '@shared/modules/dynamic-data-table/services/dynamic-data-table.service';
import { ConfigurationModalComponent } from '@dataTable/components/configuration-modal/configuration-modal.component';
import { DataTableConfigComponent } from '@shared/modules/dynamic-data-table/components/data-table-config/data-table-config.component';

@Component({
  selector: 'wid-dynamic-data-table',
  templateUrl: './dynamic-data-table.component.html',
  styleUrls: ['./dynamic-data-table.component.scss']
})
export class DynamicDataTableComponent implements OnInit {

  @Input() tableData: any[] = [];
  @Input() tableCode: string;

  modalConfiguration: any;
  displayedColumns = [];
  canBeDisplayedColumns = [];
  canBeFilteredColumns = [];
  columns = [];
  temp = [];

  constructor(
    private dynamicDataTableService: DynamicDataTableService,
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    this.temp = [...this.tableData];
    console.log('data:', this.tableData);
    console.log('tableCode', this.tableCode);
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
        this.columns = this.dynamicDataTableService.generateColumns(this.displayedColumns);
        console.log('modalConfiguration:', this.modalConfiguration);
        console.log('displayedColumns', this.displayedColumns);
        console.log('canBeDisplayedColumns:', this.canBeDisplayedColumns);
        console.log('canBeFilteredColumns', this.canBeFilteredColumns);
        console.log('columns:', this.columns);
        this.displayTableConfig();
      }
    );

  }

  displayTableConfig() {
    const data = {
      displayedColumns: this.dynamicDataTableService.generateColumns(this.displayedColumns),
      canBeDisplayedColumns: this.canBeDisplayedColumns,
      actualColumns: this.columns
    };
    this.modalService.displayModal('dynamicTableConfig', data, '40%').subscribe(
      (res) => {
        if (res.action === 'change') {
          this.columns = [...res.actualColumns];
        }
      }
    );
  }

}
