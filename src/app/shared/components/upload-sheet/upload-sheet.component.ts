import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SheetService } from '@core/services/sheet/sheet.service';

@Component({
  selector: 'wid-upload-sheet',
  templateUrl: './upload-sheet.component.html',
  styleUrls: ['./upload-sheet.component.scss']
})
export class UploadSheetComponent implements OnInit {

  selectedFiles: any;
  file: FormData;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<UploadSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,

  ) { }

  ngOnInit(): void {
  }

  openLink(event): void {
    this._bottomSheetRef.dismiss(event);
    event.preventDefault();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    // File Preview
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles[0]);
    const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
    formData.append('file', this.selectedFiles[0]);
    formData.append('caption', this.selectedFiles.item(0).name);
    this.file = formData;
    this._bottomSheetRef.dismiss({ file: this.file, name: this.selectedFiles.item(0).name, selectedFiles : this.selectedFiles});
    event.preventDefault();
  }
}
