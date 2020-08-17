import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wid-show-modal',
  templateUrl: './show-modal.component.html',
  styleUrls: ['./show-modal.component.scss']
})
export class ShowModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

}
