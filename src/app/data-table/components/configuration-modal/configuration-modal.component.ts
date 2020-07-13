import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { HelperService } from '@core/services/helper/helper.service';

@Component({
  selector: 'wid-configuration-modal',
  templateUrl: './configuration-modal.component.html',
  styleUrls: ['./configuration-modal.component.scss']
})
export class ConfigurationModalComponent implements OnInit {

  displayedColumnsForm: FormGroup;
  canBeDisplayedColumnsForm: FormGroup;
  canBeDisplayedColumns: any[];
  displayedColumns: any[];
  activeTheme = 'material';
  themes = ['dark', 'material'];

  constructor(public dialogRef: MatDialogRef<ConfigurationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private helperService: HelperService) { }

  ngOnInit(): void {
    this.displayedColumns = this.data.displayedColumns;
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
    canBeDisplayedColumnsFormArray.clear();
  }

  addToCanBeDisplayColumn() {
    const displayedColumnsFormArray = this.displayedColumnsForm.get('displayedColumns') as FormArray;
    const displayedColumns = displayedColumnsFormArray.value;
    this.canBeDisplayedColumns.push(...displayedColumns);
    this.helperService.removeSubArrayFromArray(this.displayedColumns, displayedColumns, 'prop');
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
    this.dialogRef.close(this.data);
  }

  resetColumns() {
    console.log(this.displayedColumns);
    console.log(this.canBeDisplayedColumns);
    console.log(this.data);

    this.displayedColumns = this.data.actualColumns;
    this.canBeDisplayedColumns = this.helperService.difference(this.data.canBeDisplayedColumns, this.displayedColumns, 'prop');
  }

  customizeTable() {
    this.data.action = 'themeChange';
    this.data.activeTheme = this.activeTheme;
    this.dialogRef.close(this.data);
  }

}
