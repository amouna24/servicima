import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@core/services/user/user.service';
import { IUserModel } from '@shared/models/user.model';
import { BehaviorSubject } from 'rxjs';
import { UploadPayslipService } from '@core/services/upload-payslip/upload-payslip.service';
import { range } from 'lodash';
import { UploadService } from '@core/services/upload/upload.service';

@Component({
  selector: 'wid-payslip-import',
  templateUrl: './payslip-import.component.html',
  styleUrls: ['./payslip-import.component.scss'],
})
export class PayslipImportComponent implements OnInit {
  collaboratorList: IUserModel[];
  selectedFiles = new BehaviorSubject<any[]>([]);
  totalFiles: number;
  isLoading = new BehaviorSubject<boolean>(true);
  months: string[];
  years: number[] = [];
  payslipMonth: number;
  payslipYear: number;
  constructor(
    public dialogRef: MatDialogRef<PayslipImportComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { files: any[], application_id: string, company_email: string},
    private userService: UserService,
    private uploadPayslipService: UploadPayslipService,
  ) { }

  ngOnInit(): void {
    this.getPeriod();
    this.totalFiles = Object.values(this.data.files).length;
    this.getCompanyCollaborator(this.data.application_id, this.data.company_email).then(
      async (res) => {
        this.collaboratorList = res;
        await this.getFileData(Object.values(this.data.files)).then(
          data => this.selectedFiles.next(data)
        );
      }
    ).finally(() => { this.isLoading.next(false); });
  }
  loaded(): boolean {
    return (this.selectedFiles.value.length === this.totalFiles) ;
  }
  createNewPayslip(file): any {
    return {
      application_id: this.data.application_id,
      company_email: this.data.company_email,
      file_name: file.selectedFile.name,
      file: file.reader,
    };
  }
  async getFileData(data): Promise<any[]> {
    const result = [];
    console.log(data);
    data.map(async row => {
        this.uploadPayslipService.distributePayslip(this.createNewPayslip(row)).toPromise().then(
          (res) => {
            res['collaboratorName'] = res.email_address ? this.getCollarName(res) : null;
            res['form_data'] = row.file;
            res['file_type'] = row.type;
            res['file'] = row.reader;
            result.push(res);
          });
      }
    );
    console.log(result);
    return result;
  }
  getCompanyCollaborator(applicationId, companyEmail): Promise<IUserModel[]> {
    return new Promise(
      resolve => {
        this.userService.getAllUsers(`?application_id=${applicationId}&company_email=${companyEmail}&user_type=COLLABORATOR`)
          .subscribe(
            (res) => { resolve(res['results']); }
          );
      }
    );
  }

  getCollarName(file): string {
    const collaborator = this.collaboratorList.find(value => file.email_address === value.userKey.email_address);
    return `${collaborator.first_name} ${collaborator.last_name}`;
  }

  modalActions(action?: string) {
    if (action) {
      this.dialogRef.close(action);
    } else {
      this.dialogRef.close();
    }
  }

  associate(file: any) {
        console.log('[UPLOAD]', file);
        this.uploadPayslipService.associatePayslip(
          {
            application_id: file.application_id,
            company_address: this.data.company_email,
            email_address: file.email_address,
            file: file.file,
            filename: file.filename,
            month: this.payslipMonth,
            year: this.payslipYear
          }
        ).toPromise().then( res => {
          console.log('[PAYSLIP]', res);
          file['associated'] = true;
        });
  }

  getPeriod(): void {
    const date = new Date();
    this.payslipMonth = date.getMonth() + 1;
    this.payslipYear = date.getFullYear();
    this.years = range(date.getFullYear() - 4 , date.getFullYear() + 20);
    this.months = Array.from({ length: 12}, (item, i) => {
      return new Date(0, i).toLocaleString('en-US', { month: 'long'});
    });
  }
}
