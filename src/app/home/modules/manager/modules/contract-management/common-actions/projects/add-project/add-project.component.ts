import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import {ContractsService} from "@core/services/contracts/contracts.service";

@Component({
  selector: 'wid-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  action: string;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private contractService: ContractsService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.action = 'update';
      this.setForm();
    } else {
      this.action = 'add';
    }
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      project_desc: ['', [Validators.required]],
      project_status: ['', [Validators.required]],
      project_rate: ['', [Validators.required]],
      vat_nbr: ['', [Validators.required]],
      rate_currency: ['', [Validators.required]],
      category_code: [''],
      comment: [''],
    });
  }

  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.setValue({
      start_date: this.data.start_date,
      end_date: this.data.end_date,
      project_desc: this.data.project_desc,
      project_status: this.data.project_status,
      comment: this.data.comment,
      category_code: this.data.category_code,
      project_rate: this.data.project_rate,
      rate_currency: this.data.rate_currency,
      vat_nbr: this.data.vat_nbr,
    });
    this.form.controls['startingDate'].disable();
  }

  /**
   * @description : action
   * param res: boolean
   */
  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    } else {
      if (this.data) {
        const contractProject = {
          application_id: this.userService.applicationId,
          company_email: this.userService.emailAddress,
          project_code: this.data.value.project_code,
          contract_code: this.data.value.contract_code,
          start_date: this.form.value.start_date,
          end_date: this.form.value.end_date,
          project_desc: this.form.value.project_desc,
          project_status: this.form.value.project_status,
          comment: this.form.value.comment,
          category_code: this.form.value.category_code,
          project_rate: this.form.value.project_rate,
          rate_currency: this.form.value.rate_currency,
          vat_nbr: this.form.value.vat_nbr,
        };
        this.contractService.updateContractProject(contractProject)
          .subscribe(
            (data) => {
              if (data) {
                this.dialogRef.close(true);
              }
        }, error => console.error(error));
      } else {
        const contractProject = {
          application_id: this.userService.applicationId,
          company_email: this.userService.emailAddress,
          project_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-CP`,
          contract_code: this.form.value.contract_code,
          start_date: this.form.value.start_date,
          end_date: this.form.value.end_date,
          project_desc: this.form.value.project_desc,
          project_status: this.form.value.project_status,
          comment: this.form.value.comment,
          category_code: this.form.value.category_code,
          project_rate: this.form.value.project_rate,
          rate_currency: this.form.value.rate_currency,
          vat_nbr: this.form.value.vat_nbr,
        };
        this.contractService.addContractProject(contractProject)
          .subscribe(
            (data) => {
              if (data) {
                this.contractService.getContractProject(this.userService.emailAddress).subscribe((response) => {
                  if (response) {
                    this.dialogRef.close(response);
                  }
                }, error => console.error(error));
              }
        }, error => console.error(error));
      }
    }
  }
}
