import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@core/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-test-congratulations',
  templateUrl: './test-congratulations.component.html',
  styleUrls: ['./test-congratulations.component.scss']
})
export class TestCongratulationsComponent implements OnInit {
   companyName: string;
   sessionName: string;
  constructor(private utilsService: UtilsService,
              private router: Router) { }

  ngOnInit(): void {
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

}
