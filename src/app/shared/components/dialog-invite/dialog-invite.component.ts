import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '@environment/environment';
import * as _ from 'lodash';

@Component({
  selector: 'wid-dialog-invite',
  templateUrl: './dialog-invite.component.html',
  styleUrls: ['./dialog-invite.component.scss']
})
export class DialogInviteComponent implements OnInit {
  @Input() tableColumns: any;
  @Input() data: any;
  @Input() specificData: { component: any, params: any};
  @Output() inviteButton = new EventEmitter<{ }>();
  @Output() cancelButton = new EventEmitter<{ }>();
  @Output() AddButton = new EventEmitter<{ }>();
  @Input() titleAddButton: string;
  @Input() title: string;
  @Input() buttonLeft: { color: string, background: string, title: string };
  @Input() buttonRight: { color: string, background: string, title: string };
  @Input() sortColumn: string;
  dataSource: any;
  numberColumn: string;
  tableColumnsFiltered: string[];
  selection = new SelectionModel<any>(true, []);
  env: string;
  displayIcon: boolean;
  constructor() {
    this.dataSource  = new MatTableDataSource([]);
    this.env = environment.uploadFileApiUrl + '/show/';
    this.displayIcon = true;
  }

  /**************************************************************************
   *  @description Loaded when component in init state
   *************************************************************************/
  ngOnInit(): void {
    this.tableColumns.unshift({ nameColumn: 'select', iconColumn: ''});
    this.dataSource = new MatTableDataSource(
      this.data
    );
    this.tableColumnsFiltered = this.tableColumns.map((data) => data.nameColumn);
     this.numberColumn = 510 / (this.tableColumns.length - 2) + 'px';
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * @description search field
   */
  searchField(event) {
    const filterArray = [];
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter(
      (res) => {
        const filter = [];
        for (let i = 1; i < this.tableColumnsFiltered.length; i ++) {
            filter.push(res[this.tableColumnsFiltered[i]].toLowerCase().includes(filterValue.toLowerCase()));
        }
        if (
          filter.includes(true)
        ) {
          filterArray.push(res);
        }
      },
    );
   this.display(filterArray);
  }

  /**
   * @description: Function to display data from modelList
   * @return: Data Source
   */
  display(data): void {
    this.dataSource = new MatTableDataSource(data);
  }

  /**
   * @description invite
   */
  invite() {
    this.inviteButton.emit(this.selection['_selected'] );
  }

  /**
   * @description cancel
   */
  cancel() {
    this.cancelButton.emit('cancel');
  }

  /**
   * @description sort
   * @param column: column to sort
   */
  sort(column) {
    this.displayIcon = !this.displayIcon;
    if (this.displayIcon) {
      this.dataSource.data = _.orderBy(this.dataSource.data, [data => data[column].toLowerCase()], ['asc']);
    } else {
      this.dataSource.data = _.orderBy( this.dataSource.data , [data => data[column].toLowerCase()], ['desc']);

    }
  }

  /**
   * @description go to add when array is empty
   */
  addButton() {
    this.AddButton.emit('button add' );
  }

}
