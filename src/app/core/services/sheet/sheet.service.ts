import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  appSheets: Array<{ sheetName: string, sheetComponent: any }>;
  uploadSheetActionResponse$ = new Subject<string>();

  constructor(
    private _bottomSheet: MatBottomSheet,
  ) { }

  /**************************************************************************
   * @description Register Sheets to an array
   *************************************************************************/
  registerSheets(sheetsList: Array<{ sheetName: string, sheetComponent: any }>) {
    this.appSheets = sheetsList;
  }

  /**************************************************************************
   * @description Get Sheet by Name
   *************************************************************************/
  getSheetComponentRef(sheetName: string) {
    const sheet = this.appSheets.find(sheetElement => sheetElement.sheetName === sheetName);
    return sheet.sheetComponent;
  }

  displaySheet(sheetName: string, sheetData?: object): Observable<any[] | any> {
    const sheetComponent = this.getSheetComponentRef(sheetName);
    const dialogRef = this._bottomSheet.open(sheetComponent, {
      data: sheetData,
      panelClass: 'bottom-sheet'
    });
    return dialogRef.afterDismissed();
  }

}
