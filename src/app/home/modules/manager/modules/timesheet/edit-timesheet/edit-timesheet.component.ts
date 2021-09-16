import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wid-edit-timesheet',
  templateUrl: './edit-timesheet.component.html',
  styleUrls: ['./edit-timesheet.component.scss']
})
export class EditTimesheetComponent implements OnInit {
  formType: any = { };

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(
      (param) => {
        this.formType.add = false;
        this.formType.edit = true;
        this.formType.managerMode = true;
        this.formType.type = param['type'];
      }
    );
  }

}
