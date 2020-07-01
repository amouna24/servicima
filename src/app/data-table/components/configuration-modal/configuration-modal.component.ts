import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wid-configuration-modal',
  templateUrl: './configuration-modal.component.html',
  styleUrls: ['./configuration-modal.component.scss']
})
export class ConfigurationModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfigurationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, ) { }

  ngOnInit(): void {

  }

}
