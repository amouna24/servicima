import { Component, OnInit } from '@angular/core';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
// import { startWith } from 'rxjs/operators/startWith';
// import { map } from 'rxjs/operators/map';

@Component({
  selector: 'wid-timesheets-list',
  templateUrl: './timesheets-list.component.html',
  styleUrls: ['./timesheets-list.component.scss']
})
export class TimesheetsListComponent implements OnInit {
  panelOpenState = false;
  hide = true;
  listTimesheet: ITimesheetModel[] = [];
  // myControl: FormControl = new FormControl();
  // options = ['One', 'Two', 'Three'];
  // filteredOptions: Observable<string[]>;
  constructor(private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    this.timesheetService.getTimesheet('').subscribe(
      data => {
        this.listTimesheet = data;
        console.log(this.listTimesheet);
      },
      error => console.log(error)
    );
  }
  //   this.filteredOptions = this.myControl.valueChanges.pipe(
  //     startWith(''),
  //     map(val => this.filter(val))
  //   );
  // }
  // filter(val: string): string[] {
  //   return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  // }

}
