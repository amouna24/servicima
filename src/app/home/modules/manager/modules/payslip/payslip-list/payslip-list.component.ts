import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wid-payslip-list',
  templateUrl: './payslip-list.component.html',
  styleUrls: ['./payslip-list.component.scss']
})
export class PayslipListComponent implements OnInit {
  ELEMENT_DATA = new BehaviorSubject<any[]>( []);
  isLoading = new BehaviorSubject<boolean>(false);

  constructor() { }

  ngOnInit(): void {
    this.ELEMENT_DATA.next([{
      full_name: 'mejri iheb',
      month: 'month',
      year: 2021
    }]);
  }

  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('update'):
        break;
      case ('Delete'):
        console.log('Delete');
        break;
      case ('Download'):
        console.log('Download');
        break;
    }
  }
}
