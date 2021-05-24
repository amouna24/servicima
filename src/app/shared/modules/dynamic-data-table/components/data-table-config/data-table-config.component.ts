import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelperService } from '@core/services/helper/helper.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { IConfig } from '@shared/models/configDataTable.model';
import * as _ from 'lodash';
@Component({
  selector: 'wid-data-table-config',
  templateUrl: './data-table-config.component.html',
  styleUrls: ['./data-table-config.component.scss']
})

export class DataTableConfigComponent implements OnInit {

  displayedColumnsForm: FormGroup;
  canBeDisplayedColumnsForm: FormGroup;
  canBeDisplayedColumns: IConfig[];
  displayedColumns: IConfig[];
  activeTheme = 'material';
  themes: string[] = ['dark', 'material'];
  columnsList: string[] = [];

  constructor(public dialogRef: MatDialogRef<DataTableConfigComponent>,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any, private helperService: HelperService) { }

  ngOnInit(): void {
  this.getConfig();
  }

  /**************************************************************************
   * @description get config
   *************************************************************************/
  getConfig() {
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

  /**************************************************************************
   * @description add to display column
   *************************************************************************/
  addToDisplayColumn() {
    const canBeDisplayedColumnsFormArray = this.canBeDisplayedColumnsForm.get('canBeDisplayedColumns') as FormArray;
    const canBeDisplayedColumns = canBeDisplayedColumnsFormArray.value;
    this.displayedColumns.push(...canBeDisplayedColumns);
    this.helperService.removeSubArrayFromArray(this.canBeDisplayedColumns, canBeDisplayedColumns, 'prop');
    this.displayedColumns = _.sortBy(this.displayedColumns, 'index');
    canBeDisplayedColumnsFormArray.clear();
  }

  /**************************************************************************
   * @description add to can be display column
   *************************************************************************/
  addToCanBeDisplayColumn() {
    const displayedColumnsFormArray = this.displayedColumnsForm.get('displayedColumns') as FormArray;
    const displayedColumns = displayedColumnsFormArray.value;
    this.canBeDisplayedColumns.push(...displayedColumns);
    this.helperService.removeSubArrayFromArray(this.displayedColumns, displayedColumns, 'prop');
    this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');
    displayedColumnsFormArray.clear();
  }

  /**************************************************************************
   * @description check can be display column
   *************************************************************************/
  checkCanBeDisplayedColumn(event) {
    const canBeDisplayedColumns = this.canBeDisplayedColumnsForm.get('canBeDisplayedColumns') as FormArray;
    if (event['checked']) {
      canBeDisplayedColumns.push(new FormControl(event['source']['value']));
    } else {
      const i = canBeDisplayedColumns.controls.findIndex(x => x.value === event['source']['value']);
      canBeDisplayedColumns.removeAt(i);
    }
  }

  /**************************************************************************
   * @description check display column
   *************************************************************************/
  checkDisplayedColumn(event) {
    const displayedColumns = this.displayedColumnsForm.get('displayedColumns') as FormArray;
    if (event['checked']) {
      displayedColumns.push(new FormControl(event['source']['value']));
    } else {
      const i = displayedColumns.controls.findIndex(x => x.value === event['source']['value']);
      displayedColumns.removeAt(i);
    }
  }

  /**************************************************************************
   * @description apply changes column
   *************************************************************************/
  applyColumnsChanges() {
    this.data.actualColumns = [...this.displayedColumns];
    this.data.action = 'change';
    this.data.columnsList = [...this.displayedColumns].map(col => col.prop);
    this.data.newDisplayedColumns = this.displayedColumns;
    this.data.newCanBeDisplayedColumns = this.canBeDisplayedColumns;
    this.dialogRef.close(this.data);
  }

  /**************************************************************************
   * @description reset columns
   *************************************************************************/
  resetColumns() {
    this.displayedColumns = this.localStorageService.getItem(this.data.tableCode).actualColumn;
    this.canBeDisplayedColumns = this.helperService.difference(this.data.canBeDisplayedColumns, this.displayedColumns, 'prop');
    this.displayedColumns = _.remove(this.displayedColumns, c => {
      return ((c.prop !== 'rowItem') && (c.prop !== 'Actions'));
    });
  }

  /**************************************************************************
   * @description customize table
   *************************************************************************/
  customizeTable() {
    this.data.action = 'themeChange';
    this.data.activeTheme = this.activeTheme;
    this.dialogRef.close(this.data);
  }

  /**************************************************************************
   * @description change index for can be display column
   *************************************************************************/
  onDropCanBeDisplayed(event: CdkDragDrop<string[]>) {
    this.displayColumn(event, this.canBeDisplayedColumns);
    this.canBeDisplayedColumns = _.sortBy(this.canBeDisplayedColumns, 'index');
  }

  /**************************************************************************
   * @description change index for display column
   *************************************************************************/
  onDropDisplayed(event: CdkDragDrop<string[]>) {
    this.displayColumn(event, this.displayedColumns);
    this.displayedColumns = _.sortBy(this.displayedColumns, 'index');
  }

  /**************************************************************************
   * @description permutation index for two column
   *************************************************************************/
  permutation(indexP: number, column: IConfig[]) {
    const temp: number = column[indexP].index;
    column[indexP].index = column[indexP + 1].index;
    column[indexP + 1].index = temp;
  }

  /**************************************************************************
   * @description display column with new index
   *************************************************************************/
  displayColumn(event: CdkDragDrop<string[]>, column: IConfig[]) {
    let indexP: number = event.previousIndex;
    column = _.sortBy(column, 'index');
    if (event.currentIndex > event.previousIndex) {
      while (indexP < event.currentIndex) {
        this.permutation(indexP, column);
        indexP++;
        column = _.sortBy(column, 'index');
      }
    } else {
      while (indexP > event.currentIndex) {
        this.permutation(indexP - 1, column);
        indexP--;
        column = _.sortBy(column, 'index');
      }
    }
  }
}
