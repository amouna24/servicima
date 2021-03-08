import { Component, OnDestroy, OnInit } from '@angular/core';
import { mainContentAnimation } from '@shared/animations/animations';

@Component({
  selector: 'wid-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class CandidateComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
