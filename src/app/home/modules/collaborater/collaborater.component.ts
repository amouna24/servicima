import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
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

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.refresh = true;
  }

  ngOnDestroy(): void {
  }

}
