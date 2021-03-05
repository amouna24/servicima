import { Component, OnDestroy, OnInit } from '@angular/core';
import { mainContentAnimation } from '@shared/animations/animations';

@Component({
  selector: 'wid-collaborater',
  templateUrl: './collaborater.component.html',
  styleUrls: ['./collaborater.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class CollaboraterComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
