import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wid-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent implements OnInit {

  @Input() width;
  @Input() height;
  @Input() circle: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  getMyStyles() {
    const myStyles = {
      'width.px': this.width ? this.width : '',
      'height.px': this.height ? this.height : '',
      'border-radius': this.circle ? '50%' : ''
    };
    return myStyles;
  }

}
