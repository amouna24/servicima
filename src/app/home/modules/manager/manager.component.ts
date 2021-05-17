import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
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

  constructor( private userService: UserService
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.userService.refresh = true;
  }

}
