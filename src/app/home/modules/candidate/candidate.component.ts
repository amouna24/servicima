import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
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

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.refresh = true;
  }

  ngOnDestroy(): void {
  }
}
