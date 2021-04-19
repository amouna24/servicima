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
  @Input() nbrRow;
  @Input() nbrColumn;
  @Input() circle: boolean;

  constructor() {
  }
  ngOnInit(): void {
    this.rowsNbr = Array(this.nbrRow ? parseInt(this.nbrRow, 10) : 5).fill(null).map((x, i) => i);
    this.columnsNbr = Array(this.nbrColumn ? parseInt(this.nbrColumn, 10) : 2).fill(null).map((x, i) => i);
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
