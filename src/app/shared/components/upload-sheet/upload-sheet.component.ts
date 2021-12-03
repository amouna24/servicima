import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'wid-upload-sheet',
  templateUrl: './upload-sheet.component.html',
  styleUrls: ['./upload-sheet.component.scss']
})
export class UploadSheetComponent implements OnInit {

  selectedFilesList: any[] = [];
  file: FormData;
  object: any;
  fileType: string;
  multiple: boolean;
  acceptedFormat: string;
  totalFiles = 0;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<UploadSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      multiple?: boolean,
      acceptedFormat?: string
    },
  ) { }

  ngOnInit(): void {
    this.multiple = !!this.data?.multiple;
    this.acceptedFormat = !!this.data?.acceptedFormat ? this.data.acceptedFormat : '';
  }

  openLink(event): void {
    this._bottomSheetRef.dismiss(event);
    event.preventDefault();
  }

  closeUploadSheet(): void {
    this._bottomSheetRef.dismiss();
  }
  selectFile(event) {
    this.selectedFilesList = [];
    Object.values(event.target.files).map(
      fileRow => {
        const reader = new FileReader();
        reader.readAsDataURL(fileRow as Blob);
        const formData = new FormData();
        // @ts-ignore
        formData.append('file', fileRow);
        // @ts-ignore
        formData.append('caption', fileRow.name);
        this.file = formData;
        this.fileType = fileRow['name'].split('.').pop().toLowerCase(),
          reader.onload = () => {
            this.selectedFilesList.push({
              file: this.file,
              selectedFile: fileRow,
              type: this.fileType,
              reader: reader.result});
          };
      }
    );
    this.totalFiles = Object.values(event.target.files).length;
    event.preventDefault();
  }
  confirm(): void {
    if (this.multiple) {
      this._bottomSheetRef.dismiss(this.selectedFilesList);
    } else {
      this._bottomSheetRef.dismiss(this.selectedFilesList[0]);
    }
  }
}
