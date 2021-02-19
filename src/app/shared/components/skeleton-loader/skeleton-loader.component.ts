import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wid-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {

  rowsNbr =  [];
  columnsNbr = [];
  @Input() width;
  @Input() height;
  @Input() circle: boolean;

  constructor() {
    this.rowsNbr = Array(5).fill(null).map((x, i) => i);
    this.columnsNbr = Array(2).fill(null).map((x, i) => i);
  }

  ngOnInit(): void {
  }

  getMyStyles() {
    const myStyles = {
      'width.px': this.width ? this.width : '',
      'height.px': this.height ? this.height : '',
      'border-radius': this.circle ? '50%' : '',
      'margin-top': '20px'
    };
    return myStyles;
  }

}
