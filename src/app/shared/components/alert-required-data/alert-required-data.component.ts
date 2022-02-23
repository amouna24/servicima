import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wid-alert-required-data',
  templateUrl: './alert-required-data.component.html',
  styleUrls: ['./alert-required-data.component.scss']
})
export class AlertRequiredDataComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, ) { }

  ngOnInit(): void { }

}
