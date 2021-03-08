import { Component, OnDestroy, OnInit } from '@angular/core';
import { mainContentAnimation } from '@shared/animations/animations';

@Component({
  selector: 'wid-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class ManagerComponent implements OnInit, OnDestroy {

  constructor(
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

}
