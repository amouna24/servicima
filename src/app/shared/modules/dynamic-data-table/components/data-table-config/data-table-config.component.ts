import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from '@core/services/helper/helper.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import * as _ from 'lodash';
@Component({
  selector: 'wid-data-table-config',
  templateUrl: './data-table-config.component.html',
  styleUrls: ['./data-table-config.component.scss']
})
export class DataTableConfigComponent implements OnInit {

  displayedColumnsForm: FormGroup;
  canBeDisplayedColumnsForm: FormGroup;
  canBeDisplayedColumns: any[];
  displayedColumns: any[];
  activeTheme = 'material';
  themes = ['dark', 'material'];
  columnsList = [];

  constructor(public dialogRef: MatDialogRef<DataTableConfigComponent>,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any, private helperService: HelperService) { }

  ngOnInit(): void {
    this.displayedColumns = this.data.displayedColumns;
    this.columnsList = this.data.columnsList;
    this.canBeDisplayedColumns = this.helperService.difference(this.data.canBeDisplayedColumns, this.displayedColumns, 'prop');
    this.displayedColumnsForm = new FormGroup({
      displayedColumns: new FormArray([])
    });
    this.canBeDisplayedColumnsForm = new FormGroup({
      canBeDisplayedColumns: new FormArray([])
    });
  }

  addToDisplayColumn() {
    const canBeDisplayedColumnsFormArray = this.canBeDisplayedColumnsForm.get('canBeDisplayedColumns') as FormArray;
    const canBeDisplayedColumns = canBeDisplayedColumnsFormArray.value;
    this.displayedColumns.push(...canBeDisplayedColumns);
    this.helperService.removeSubArrayFromArray(this.canBeDisplayedColumns, canBeDisplayedColumns, 'prop');
    this.displayedColumns = _.sortBy(this.displayedColumns, 'index');
    canBeDisplayedColumnsFormArray.clear();
  }

  addToCanBeDisplayColumn() {
    const displayedColumnsFormArray = this.displayedColumnsForm.get('displayedColumns') as FormArray;
    const displayedColumns = displayedColumnsFormArray.value;
    this.canBeDisplayedColumns.push(...displayedColumns);
    this.helperService.removeSubArrayFromArray(this.displayedColumns, displayedColumns, 'prop');
    this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');
    displayedColumnsFormArray.clear();
  }

  checkCanBeDisplayedColumn(event) {
    const canBeDisplayedColumns = this.canBeDisplayedColumnsForm.get('canBeDisplayedColumns') as FormArray;
    if (event['checked']) {
      canBeDisplayedColumns.push(new FormControl(event['source']['value']));
    } else {
      const i = canBeDisplayedColumns.controls.findIndex(x => x.value === event['source']['value']);
      canBeDisplayedColumns.removeAt(i);
    }
  }

  checkDisplayedColumn(event) {
    const displayedColumns = this.displayedColumnsForm.get('displayedColumns') as FormArray;
    if (event['checked']) {
      displayedColumns.push(new FormControl(event['source']['value']));
    } else {
      const i = displayedColumns.controls.findIndex(x => x.value === event['source']['value']);
      displayedColumns.removeAt(i);
    }
  }

  applyColumnsChanges() {
    this.data.actualColumns = [...this.displayedColumns];
    this.data.action = 'change';
    this.data.columnsList = [...this.displayedColumns].map(col => col.prop);
    this.data.newDisplayedColumns = this.displayedColumns;
    this.data.newCanBeDisplayedColumns = this.canBeDisplayedColumns;
    this.dialogRef.close(this.data);
  }

  resetColumns() {
    this.displayedColumns = this.localStorageService.getItem(this.data.tableCode).actualColumn;
    this.canBeDisplayedColumns = this.helperService.difference(this.data.canBeDisplayedColumns, this.displayedColumns, 'prop');
    this.displayedColumns = _.remove(this.displayedColumns, c => {
      return ((c.prop !== 'rowItem') && (c.prop !== 'Actions'));
    });
  }

  customizeTable() {
    this.data.action = 'themeChange';
    this.data.activeTheme = this.activeTheme;
    this.dialogRef.close(this.data);
  }

  onDropCanBeDisplayed(event: CdkDragDrop<string[]>) {
    this.organiseColumn(event, this.canBeDisplayedColumns);
    this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');

  }

  onDropDisplayed(event: CdkDragDrop<string[]>) {
    this.organiseColumn(event, this.displayedColumns);
    this.displayedColumns = _.sortBy(this.displayedColumns, 'index');

  }

  permutation(indexp: number, column) {
    const temp = column[indexp].index;
    column[indexp].index = column[indexp + 1].index;
    column[indexp + 1].index = temp;

  }

  organiseColumn(event, column) {
    let indexp = event.previousIndex;
    column = _.sortBy(column, 'index');
    if (event.currentIndex > event.previousIndex) {
      while (indexp < event.currentIndex) {
        this.permutation(indexp, column);
        indexp++;
        column = _.sortBy(column, 'index');
      }
    } else {
      while (indexp > event.currentIndex) {
        this.permutation(indexp - 1, column);
        indexp--;
        column = _.sortBy(column, 'index');
      }

    }
  }

}
