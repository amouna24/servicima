import { Component, Input, OnInit } from '@angular/core';
import { IError } from '@shared/models/error.model';
import { UtilsService } from '@core/services/utils/utils.service';
@Component({
  selector: 'wid-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})

export class ErrorComponent implements OnInit {
  @Input() type;
  error: IError;
  constructor(private utilService: UtilsService) { }

  ngOnInit(): void {
    this.error = this.utilService.getErrorPage(this.type);
  }
  getImageBeckground(img: string): any {
    let url = 'assets/img/';
    url += img;
    return { 'background-image': 'url(' + url + ')'};
  }

}
