import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@core/services/utils/utils.service';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-test-congratulations',
  templateUrl: './test-congratulations.component.html',
  styleUrls: ['./test-congratulations.component.scss']
})
export class TestCongratulationsComponent implements OnInit {
   companyName: string;
   sessionName: string;
   photo: string;
   env = environment.uploadFileApiUrl + '/show/';

  constructor(private utilsService: UtilsService,
              private router: Router,
              private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getConnectedUser();
    this.utilsService.verifyCurrentRoute('/candidate/test-management/welcome-to-test').subscribe( (data) => {
      this.companyName = data['companyName'];
      this.sessionName =  data['sessionName'];
    });
  }

  /**
   * @description: back to home
   */
  back(event: Event) {
    console.log(event, 'event');
    this.router.navigate(['/candidate']);
  }
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.photo = userInfo['company'][0].photo;
          }
        });
  }

}
