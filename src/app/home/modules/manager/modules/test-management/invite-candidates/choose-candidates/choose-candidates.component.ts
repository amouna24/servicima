import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '@environment/environment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'wid-choose-candidates',
  templateUrl: './choose-candidates.component.html',
  styleUrls: ['./choose-candidates.component.scss']
})
export class ChooseCandidatesComponent implements OnInit {
  tableColumnsInvoiceAttachment: string[] = ['select', 'Full Name', 'email', 'phone'];
  dataSourceInvoiceAttachment: MatTableDataSource<any> = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  env: string;
  displayIcon: boolean;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, ) {
   this.env = environment.uploadFileApiUrl + '/show/';
    this.displayIcon = true;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceInvoiceAttachment.data.forEach(row => this.selection.select(row));
}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceInvoiceAttachment.data.length;
    return numSelected === numRows;
  }

  ngOnInit(): void {
     this.dataSourceInvoiceAttachment = new MatTableDataSource(
       this.data
     );
  }

  searchField(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInvoiceAttachment.filter = filterValue.trim().toLowerCase();
  }

  sendMail() {
    console.log(this.selection['_selected'], 'selected');
  }

  sort() {
    this.displayIcon = !this.displayIcon;
    if (this.displayIcon) {
      this.dataSourceInvoiceAttachment.data = _.orderBy(this.dataSourceInvoiceAttachment.data, [user => user.fullName.toLowerCase()], ['asc']);

    } else {
      this.dataSourceInvoiceAttachment.data = _.orderBy( this.dataSourceInvoiceAttachment.data , [user => user.fullName.toLowerCase()], ['desc']);

    }
  }

}
