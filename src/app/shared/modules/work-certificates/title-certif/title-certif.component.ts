// tslint:disable-next-line:origin-ordered-imports
import { Component, Input, OnInit } from '@angular/core';

// tslint:disable-next-line:origin-ordered-imports
import { Location } from '@angular/common';
@Component({
  selector: 'wid-title-certif',
  templateUrl: './title-certif.component.html',
  styleUrls: ['./title-certif.component.scss']
})
export class TitleCertifComponent implements OnInit {

@Input() certificate: any;
@Input() position: any;
  constructor(
    private location: Location,

) {

  }

  ngOnInit(): void {
  }
  /**************************************************************************
   * @description Go to the previous route
   *************************************************************************/
  backClicked() {
    this.location.back();
  }

}
