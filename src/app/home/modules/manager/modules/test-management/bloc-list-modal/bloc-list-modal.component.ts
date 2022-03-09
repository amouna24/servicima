import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '@environment/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wid-bloc-list-modal',
  templateUrl: './bloc-list-modal.component.html',
  styleUrls: ['./bloc-list-modal.component.scss']
})
export class BlocListModalComponent implements OnInit {
  imageUrl: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.imageUrl = `${environment.uploadFileApiUrl}/image/`;
  }

}
