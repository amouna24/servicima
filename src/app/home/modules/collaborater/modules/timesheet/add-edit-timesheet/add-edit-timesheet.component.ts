import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wid-add-edit-timesheet',
  templateUrl: './add-edit-timesheet.component.html',
  styleUrls: ['./add-edit-timesheet.component.scss']
})
export class AddEditTimesheetComponent implements OnInit {
  formType: any = { };

  constructor(private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getFormType();
  }
  /**
   * @description : Get form type Add or Edit
   */
  getFormType(): void {
    this.activeRoute.params.subscribe(
      (param) => {
        this.formType.add = param['action'] === 'add';
        this.formType.edit = param['action'] === 'edit';
        this.formType.type = param['type'];
        this.formType.managerMode = false;
      }
    );
    }

}
