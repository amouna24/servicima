import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@core/services/utils/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { UploadService } from '@core/services/upload/upload.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SheetService } from '@core/services/sheet/sheet.service';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { map } from 'rxjs/internal/operators/map';
import { ExpensesService } from '@core/services/expenses/expenses.service';

@Component({
  selector: 'wid-bank-statement',
  templateUrl: './add-bank-statement.component.html',
  styleUrls: ['./add-bank-statement.component.scss']
})
export class AddBankStatementComponent implements OnInit {

  form: FormGroup;
  companyEmail: string;
  companyName: string;
  bankStatementInfo: any;
  attachment = '';
  code: string;
  fileName: string;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private location: Location,
              private sheetService: SheetService,
              private route: ActivatedRoute,
              private utilsService: UtilsService,
              private uploadService: UploadService,
              private expenseService: ExpensesService) {
    this.getConnectedUser();
    if (this.route.snapshot.queryParams['bank_statement_code']) {
      this.utilsService.verifyCurrentRoute('/manager/expenses/add-bank-statement').subscribe((data) => {
          this.code = data.bank_statement_code;
        }
      );
    }
  }

  ngOnInit(): void {
    this.sheetService.registerSheets([{ sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent}]);
    this.getConnectedUser();
    if (this.code) {
      this.getBankStatements(this.code);
    }
    this.initForm();
  }

  async importAttachment(): Promise<void> {
    this.sheetService.displaySheet('uploadSheetComponent', null)
      .subscribe(
        async (res) => {
          if (!!res) {
            const file = res.selectedFile;
            if (file?.size > 100000) {
              this.snackBarAction();
            } else {
            const formData = new FormData();
            const file1 = new File([file], file['name'], {
              lastModified: new Date().getTime(),
              type: file.type
            });
            formData.append('file', file1);
            formData.append('caption', file1.name);
          this.fileName = await this.uploadFile(formData);
          this.form.patchValue({ 'attachment': this.fileName });
            }
          }});
  }

  /**************************************************************************
   * @description Upload Image to Server
   * @param formData: formData
   *************************************************************************/
  async uploadFile(formData: FormData): Promise<string> {
    return await this.uploadService.uploadImage(formData)
      // return await this.uploadService.uploadImageLocal(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }
  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.patchValue({
        bankName: this.bankStatementInfo['bank_name'],
        bankStatementDate: new Date(this.bankStatementInfo['bank_statement_date']).toISOString().split('T')[0],
        bankStatementDesc: this.bankStatementInfo['bank_statement_desc'],
        attachment: this.bankStatementInfo['attachment'],
      }
    );
  }
  snackBarAction() {
    this.utilsService.openSnackBar('the image must be less than 1mb  ', 'Undo',
      3000);
  }

  /**
   * @description : get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$.subscribe(
      (userInfo) => {
        if (userInfo) {
          this.companyName = userInfo['company'][0].company_name;
          this.companyEmail = userInfo['company'][0].companyKey.email_address;
        }
      });
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      bankName: ['', [Validators.required]],
      bankStatementDate: ['', [Validators.required]],
      bankStatementDesc: [''],
      attachment: '',
    });
  }

  /**
   * @description : Add or edit company banking information
   */
  addOrEdit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {

    const bankingStatementInfo = {
      application_id: this.userService.applicationId,
      company_email: this.companyEmail,
      attachment: this.fileName ? this.fileName : this.form.value.attachment,
      bank_name: this.form.value.bankName,
      bank_statement_code: this.code ? this.code : `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-BSC`,
      bank_statement_date: this.form.value.bankStatementDate,
      bank_statement_desc: this.form.value.bankStatementDesc
    };
    if (this.code) {
      this.expenseService.updateBankStatement(bankingStatementInfo).subscribe((data) => {
        this.router.navigate(['/manager/expenses/list-bank-statement']);
      });
    } else {
      this.expenseService.addBankStatement(bankingStatementInfo).subscribe((data) => {
        this.bankStatementInfo = data.bankStatementInfo;
        this.router.navigate(['/manager/expenses/list-bank-statement']);
      });
    }
    }
  }

  /**
   * @description : get company banking information
   */
  getBankStatements(code) {
    this.expenseService.getBankStatement(`?company_email=${this.companyEmail}&bank_statement_code=${code}`).subscribe((data) => {
      if (data.length > 0) {
        this.bankStatementInfo = data[0];
        this.setForm();
      }
    });

  }
  back() {
    this.location.back();
  }
}
