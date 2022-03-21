import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-test-congratulations',
  templateUrl: './test-congratulations.component.html',
  styleUrls: ['./test-congratulations.component.scss']
})
export class TestCongratulationsComponent implements OnInit {
   companyName: string;
   sessionName: string;
  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.utilsService.verifyCurrentRoute('/candidate/test-management/welcome-to-test').subscribe( (data) => {
      this.companyName = data['companyName'];
      this.sessionName =  data['sessionName'];
    });
  }
  back(event) {
    console.log('dhax', event);
  }

}
