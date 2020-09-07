import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wid-show-extension',
  templateUrl: './show-extension.component.html',
  styleUrls: ['./show-extension.component.scss']
})
export class ShowExtensionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShowExtensionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

}
