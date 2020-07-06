import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
   // this.userService.getUserInfoo();
  }

}
