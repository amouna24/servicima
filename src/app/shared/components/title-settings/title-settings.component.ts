import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'wid-title-settings',
  templateUrl: './title-settings.component.html',
  styleUrls: ['./title-settings.component.scss']
})
export class TitleSettingsComponent implements OnInit {
  @Input() title: string;
  @Input() backBtn: boolean;
  constructor(   private location: Location, ) { }

  ngOnInit(): void {
  }

  backClicked() {
    this.location.back();
  }
}
