import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@core/services/user/user.service';
import { IUserModel } from '@shared/models/user.model';
import { BehaviorSubject } from 'rxjs';
import { UploadPayslipService } from '@core/services/upload-payslip/upload-payslip.service';

@Component({
  selector: 'wid-payslip-import',
  templateUrl: './payslip-import.component.html',
  styleUrls: ['./payslip-import.component.scss']
})
export class PayslipImportComponent implements OnInit {
  collaboratorList: IUserModel[];
  selectedFiles: any[] = [];
  unknownFiles: any[] = [];
  totalFiles: number;
  isLoading = new BehaviorSubject<boolean>(true);
  selectedCollaborator: string;
  associateAllBtn = true;
  constructor(
    public dialogRef: MatDialogRef<PayslipImportComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { files: any[], application_id: string, company_email: string},
    private userService: UserService,
    private uploadPayslipService: UploadPayslipService
  ) { }

  ngOnInit(): void {
    this.totalFiles = Object.values(this.data.files).length;
    this.getCompanyCollaborator(this.data.application_id, this.data.company_email).then(
      async (res) => {
        this.collaboratorList = res;
        await this.getFileData(Object.values(this.data.files));
        this.detectUnknownFile();
      }
    ).finally( () => { this.isLoading.next(false); });
  }

  createNewPayslip(file): any {
    return {
      application_id: this.data.application_id,
      company_email: this.data.company_email,
      file_name: file.selectedFile.name,
      file: file.reader,
    };
  }
  async getFileData(data) {
    data.map(row => {
        this.uploadPayslipService.distributePayslip(this.createNewPayslip(row)).toPromise().then(
          (res) => {
            res['collaboraterName'] = res.email_address ? this.getCollabName(res) : null;
            res['associated'] = false;
            res['form_data'] = row.file;
            res['file_type'] = row.type;
            if (res.email_address) {
              this.selectedFiles.push(res);
            } else {
              this.unknownFiles.push(res);
            }

          });
      }
    );
  }
  detectUnknownFile(): string {
    if (this.unknownFiles.length > 0) {
      if (this.unknownFiles.length === 1) {
        return `There is one file unknown`;
      } else {
        return `There is ${this.unknownFiles.length} files unknown`;
      }
    }
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

  getCollabName(file): string {
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
    const data = {
      application_id: file.application_id,
      company_address: this.data.company_email,
      email_address: file.email_address,
      file: file.form_data,
      file_name: file.filename,
      month: 1,
      year: 2
    };
    this.uploadPayslipService.associatePayslip(data).toPromise().then(
      res => {
        file['associated'] = true;
      }
    );
  }

  openFile(file) {
    //
  }

  associateAll() {
    this.selectedFiles.map(
      (row) => {
        if (!row.associated && row.email_address) {
          this.associate(row);
        }
      });
  }
}
