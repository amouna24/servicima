import { Component, Input, OnInit, Sanitizer } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IExpenseHeaderModel } from '@shared/models/expenseheader.model';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ExpensesService } from '@core/services/expenses/expenses.service';
import { takeUntil } from 'rxjs/operators';
import { SheetService } from '@core/services/sheet/sheet.service';
import { Subject } from 'rxjs';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { ModalService } from '@core/services/modal/modal.service';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { IExpenseLineModel } from '@shared/models/expenseline.model';
import { IExpenseFooterModel } from '@shared/models/expensefooter.model';
import { environment } from '@environment/environment';
import { dataAppearance } from '@shared/animations/animations';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';
import { IExpenseRecurringModel } from '@shared/models/expenserecurring.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wid-expenses-add',
  templateUrl: './expenses-add.component.html',
  styleUrls: ['./expenses-add.component.scss'],
  animations: [
    dataAppearance
  ]

})
export class ExpensesAddComponent implements OnInit {
  formHeader: FormGroup;
  formLine: FormGroup;
  formFooter: FormGroup;
  @Input() headerType = '';
  formHeaderRecurring: FormGroup;
  expenseHeaderObject: IExpenseHeaderModel;
  companyEmailAddress: string;
  expenseNbr = 0;
  attachment = '';
  expenseLinesList = [];
  addExpenseHeader: boolean;
  emptyLines: boolean;
  env = environment.uploadFileApiUrl + '/show/';
  addLine: boolean;
  showExpenseLine: boolean;
  showExpenseFooter: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private fileUpload: object;
  companyTaxesList = [];
  expenseHeaderRecurringObject: IExpenseRecurringModel;
  uploadedFileReader: string;
  expenseFooterObject: IExpenseFooterModel;
  oldExpenseLineList: IExpenseLineModel[];
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private utilsService: UtilsService,
    private expenseService: ExpensesService,
    private router: Router,
    private sheetService: SheetService,
    private modalServices: ModalService,
    private uploadService: UploadService,
    private taxesService: CompanyTaxService,
    private route: ActivatedRoute
  ) {
    this.getConnectedUser();
    this.getOldForms();
  }

  async ngOnInit(): Promise<void> {
    this.sheetService.registerSheets([{ sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent}]);
    this.initDisplayOption();
    this.createFormHeader();
    this.createFormLine();
    this.createFormFooter();
    if (this.expenseNbr === 0) {
      this.getLastExpenseNumber();
    }
    this.getTaxes();
  }

  createFormHeader() {
    this.formHeader = this.fb.group({
      expense_title: [this.expenseHeaderObject ? this.expenseHeaderObject.expense_title : '', [Validators.required]],
      supplier_name: [this.expenseHeaderObject ? this.expenseHeaderObject.supplier_name : '', [Validators.required]],
      expense_date: [this.expenseHeaderObject ? this.expenseHeaderObject.expense_date : '', [Validators.required]],
      tax_code: [this.expenseHeaderObject ? this.expenseHeaderObject.tax_code : '', [Validators.required]],
      expense_nbr: [this.expenseHeaderObject ? this.expenseHeaderObject.expense_nbr : '', [Validators.required]],
      attachment: this.expenseHeaderObject ? this.expenseHeaderObject.attachment : '',
      expense_description: this.expenseHeaderObject ? this.expenseHeaderObject.expense_description : '',
    });
    if (this.headerType === 'recurring') {
      this.createFormHeaderRecurring();
    }
  }

  createFormHeaderRecurring() {
    this.formHeaderRecurring = this.fb.group({
      expense_final_date: ['', [Validators.required]],
      frequency_nbr: ['', [Validators.required]],
      frequency_period: ['', [Validators.required]],
    });
  }

  createFormLine() {
    this.formLine = this.fb.group({
      expense_product_title: ['', [Validators.required]],
      expense_line_description: ['', [Validators.required]],
      price_without_vat: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      vat: ['', [Validators.required]],
    });
  }

  createFormFooter() {
    this.formFooter = this.fb.group({
      expense_comment: ''
    });
  }

  async addNewExpenseHeader() {
    this.expenseHeaderObject = this.formHeader.getRawValue();
    this.expenseHeaderObject.company_email = this.companyEmailAddress;
    this.expenseHeaderObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
    this.expenseHeaderObject.expense_type = this.headerType;
    this.expenseHeaderObject.email_address = this.userService.connectedUser$.getValue().user[0].userKey.email_address;
    this.expenseHeaderObject.tax_code = this.formHeader.controls.tax_code.value.companyTaxKey.tax_code;
    this.expenseHeaderObject.status = true;
    if (this.fileUpload) {
      this.uploadedFileReader = URL.createObjectURL(this.fileUpload['selectedFile']);
    }
    if (this.headerType === 'recurring') {
      this.expenseHeaderRecurringObject = this.formHeaderRecurring.value;
      this.expenseHeaderRecurringObject.company_email = this.companyEmailAddress;
      this.expenseHeaderRecurringObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      this.expenseHeaderRecurringObject.expense_nbr = this.expenseNbr.toString();
    }
    this.saveExpense();
  }

  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  getLastExpenseNumber() {
    this.expenseService.getExpenseHeader(`?company_email=${
      this.companyEmailAddress}&application_id=${
      this.utilsService.getApplicationID('SERVICIMA')}`).subscribe((expenseHeaderList) => {
      if (expenseHeaderList['msg_code'] !== '0004') {
        const numberList: number[] = expenseHeaderList.map((expenseHeader) => Number(expenseHeader.ExpenseHeaderKey.expense_nbr));
        this.expenseNbr = numberList.reduce((a, b) => Math.max(a, b)) + 1;
      } else {
        this.expenseNbr = 1;
      }
      /*
              Math.max(expenseHeaderList.map( (expenseHeader) => expenseHeader.expense_nbr));
      */
    });
  }

  openUploadSheet(): Promise<any[]> {
    return new Promise(
      (resolve, reject) => {
        this.sheetService.displaySheet('uploadSheetComponent', { multiple: false, acceptedFormat: '.pdf'})
          .pipe(takeUntil(this.destroy$)).toPromise()
          .then((res) => {
            !!res ? resolve(res) : reject('Error');
          });
      });
  }

  async importAttachment(): Promise<void> {
    this.openUploadSheet().then(
      async (data) => {
        if (data) {
          this.fileUpload = data;
          this.attachment = data['name'];
        }
      });
  }

  async uploadFile(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }

  async editExpenseHeader() {
    this.addExpenseHeader = true;
    this.formHeader.controls.expense_nbr.disable();
  }

  addNewRow() {
    const expenseLineObject: IExpenseLineModel = this.formLine.value;
    expenseLineObject.company_email = this.companyEmailAddress;
    expenseLineObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
    expenseLineObject.expense_nbr = this.expenseNbr.toString();
    expenseLineObject.expense_line_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-EXPENSE-LINE`,
      this.expenseLinesList.push(expenseLineObject);
    this.createFormLine();
  }

  async addOrUpdateExpense() {
      if (this.fileUpload) {
        this.expenseHeaderObject.attachment = await this.uploadFile(this.fileUpload['file']);
      }
    if (!this.route.snapshot.queryParams['expense_nbr']) {
      this.expenseService.addExpenseHeader(this.expenseHeaderObject).subscribe((expense) => {
        console.log('expense added');

      });
      if (this.headerType === 'recurring') {
        this.expenseService.addExpenseRecurring(this.expenseHeaderRecurringObject).subscribe((expenseRecurring) => {
          console.log('expense recurring added');
        });
      }
    } else {
      this.expenseService.updateExpenseHeader(this.expenseHeaderObject)
        .subscribe((expense) => {
        console.log('expense updated');

      });
      if (this.headerType === 'recurring') {
        if (!this.route.snapshot.queryParams['expense_nbr']) {
          this.expenseService.updateExpenseRecurring(this.expenseHeaderRecurringObject).subscribe((expenseRecurring) => {
            console.log('expense recurring updated');
          });
        }
      }
    }
    if (this.route.snapshot.queryParams['expense_nbr']) {
      this.oldExpenseLineList.map( (oldExpenseLine) => {
        if (this.expenseLinesList.indexOf(oldExpenseLine) === -1) {
          this.expenseService.deleteExpenseLine(oldExpenseLine._id).subscribe((deletedExpenseLine) => {
            console.log('old expense line deleted', deletedExpenseLine);
          });
        }
      });
      this.expenseLinesList.map((oneExpense) => {
        if (this.oldExpenseLineList.indexOf(oneExpense) === -1) {
          this.expenseService.addExpenseLine(oneExpense).subscribe((newExpenseLine) => {
            console.log('new expense line added', newExpenseLine);
          });
        }
      });
    } else {
          this.expenseLinesList.map((expenseLine) => {
            this.expenseService.addExpenseLine(expenseLine).subscribe((expenseLineAdded) => {
              console.log('expenseLine Added', expenseLineAdded);
            });
          });
    }

    this.expenseFooterObject = this.formFooter.value;
    this.expenseFooterObject.company_email = this.companyEmailAddress;
    this.expenseFooterObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
    this.expenseFooterObject.expense_nbr = this.expenseNbr.toString();
    this.expenseService.getExpenseFooter(`?company_email=${
      this.companyEmailAddress}&expense_nbr=${this.expenseNbr}`)
      .subscribe( (expenseFooter) => {
        if (expenseFooter['msg_code'] === '0004') {
          if (this.expenseFooterObject.expense_comment !== '') {
            this.expenseService.addExpenseFooter(this.expenseFooterObject).subscribe((addedExpenseFooter) => {
              console.log('footer added', addedExpenseFooter);
            });
          }
        } else {
          if (this.expenseFooterObject.expense_comment !== '') {
            this.expenseService.updateExpenseFooter(this.expenseFooterObject).subscribe((addedExpenseFooter) => {
            console.log('footer updated', addedExpenseFooter);
          });
        } else {
            this.expenseService.deleteExpenseFooter(this.expenseFooterObject._id).subscribe((addedExpenseFooter) => {
              console.log('footer deleted', addedExpenseFooter);
            });
          }
        }
    });

    this.router.navigate([this.headerType === 'normal' ?
      '/manager/expenses/expenses-normal/expense-list' :
      '/manager/expenses/expenses-recurring/expense-list-recurring']);
  }

  calculateExpenses(params) {
    let subTotal = 0;
    let vat = 0;
    this.expenseLinesList.map((expense) => {
      subTotal += expense.price_without_vat * expense.quantity;
      vat += ((expense.vat * expense.price_without_vat) / 100) * expense.quantity;
    });
    const total = this.expenseLinesList.length !== 0 ? subTotal + ((vat * 100) / subTotal) : 0;
    if (params === 'total') {
      return total.toFixed(2);
    } else if (params === 'vat') {
      return vat.toFixed(2);
    } else {
      return subTotal.toFixed(2);
    }
  }

  calculateTTC(withoutVat, vat, quantity) {
    const withoutVatNumber = Number(withoutVat);
    const vatNumber = Number(vat);
    const quantityNumber = Number(quantity);
    if (
      withoutVat !== '' &&
      quantity !== '' &&
      vat !== '') {
      return ((withoutVatNumber +
        ((withoutVatNumber * vatNumber) / 100)) * quantityNumber).toFixed(2);
    } else {
      return '00.00';
    }
  }

  getTaxes() {
    this.taxesService.getCompanyTax(this.companyEmailAddress).subscribe((taxes) => {
      this.companyTaxesList = taxes['results'];
      if (this.route.snapshot.queryParams['expense_nbr']) {
        this.companyTaxesList.map((oneTax) => {
          if (this.expenseHeaderObject.tax_code === oneTax.companyTaxKey.tax_code) {
            this.formHeader.patchValue({
              tax_code: oneTax,
            });
          }
        });
      }
    });
  }

  deleteLine(row: IExpenseLineModel, pointIndex: number) {
    this.expenseLinesList.splice(pointIndex, 1);
    if (this.expenseLinesList.length === 0) {
      this.emptyLines = true;
    }
  }

  openFile() {
    window.open(this.fileUpload ? this.uploadedFileReader : this.env + this.expenseHeaderObject.attachment, '_blank');
  }

  saveExpense() {
    if (!this.route.snapshot.queryParams['expense_nbr']) {
      this.expenseService.getExpenseHeader(`?company_email=${
        this.companyEmailAddress}&application_id=${
        this.utilsService.getApplicationID('SERVICIMA')}&expense_nbr=${this.expenseNbr}`).subscribe((expenseHeader) => {
        if (expenseHeader['msg_code'] === '0004') {
          this.addExpenseHeader = false;
          this.addLine = true;
          this.showExpenseLine = true;
          this.showExpenseFooter = true;
        } else {
          this.utilsService.openSnackBar('Expense number already exist you should use another', 'close');
        }
      });
    } else  {
      this.addExpenseHeader = false;
      this.addLine = true;
      this.showExpenseLine = true;
      this.showExpenseFooter = true;
    }
  }

  cancelExpense() {
    this.createFormFooter();
    this.createFormHeaderRecurring();
    this.createFormLine();
    this.createFormHeader();
    this.addExpenseHeader = true;
    this.emptyLines = true;
    this.addLine = false;
    this.showExpenseLine = false;
    this.showExpenseFooter = false;
  }

  getOldForms() {
    if (this.route.snapshot.queryParams['expense_nbr']) {
    this.utilsService.verifyCurrentRoute('/manager/expenses/expenses-normal/expense-list').subscribe( (data) => {
      if (data.expense_nbr) {
        this.expenseNbr = data.expense_nbr;
        this.expenseService.getExpenseHeader(`?company_email=${
          this.companyEmailAddress}&expense_nbr=${data.expense_nbr}`).subscribe((expenseHeader) => {
            this.expenseHeaderObject = expenseHeader[0];
            this.formHeader.patchValue({
              expense_title: this.expenseHeaderObject.expense_title,
              supplier_name: this.expenseHeaderObject.supplier_name,
              expense_date: this.expenseHeaderObject.expense_date,
              expense_nbr:  data.expense_nbr,
              attachment: this.expenseHeaderObject.attachment,
              expense_description: this.expenseHeaderObject.expense_description,
            });
          this.formHeader.controls.expense_nbr.disable();
          this.expenseService.getExpenseLine(`?company_email=${
              this.companyEmailAddress}&application_id=${
              this.utilsService.getApplicationID('SERVICIMA')}&expense_nbr=${data.expense_nbr}`).subscribe((expenseLine) => {
                this.expenseLinesList = [...expenseLine];
                this.oldExpenseLineList = [...expenseLine];
                this.expenseService.getExpenseFooter(`?company_email=${
                  this.companyEmailAddress}&application_id=${
                  this.utilsService.getApplicationID('SERVICIMA')}&expense_nbr=${data.expense_nbr}`).subscribe((expenseFooter) => {
                    this.expenseFooterObject = expenseFooter[0];
                    this.formFooter.patchValue({
                      expense_comment: this.expenseFooterObject.expense_comment
                    });
                    if (this.headerType === 'recurring') {
                      this.expenseService.getExpenseRecurring(`?company_email=${
                        this.companyEmailAddress}&application_id=${
                        this.utilsService.getApplicationID('SERVICIMA')}&expense_nbr=${data.expense_nbr}`).subscribe((expenseRecurring) => {
                          this.expenseHeaderRecurringObject = expenseRecurring[0];
                          this.formHeaderRecurring.patchValue({
                            expense_final_date: this.expenseHeaderRecurringObject.expense_final_date,
                            frequency_nbr: this.expenseHeaderRecurringObject.frequency_nbr,
                            frequency_period: this.expenseHeaderRecurringObject.frequency_period,
                          });
                      });
                    }
                });
            });
        });
      }
    });
    }
  }
  initDisplayOption() {
    if (this.route.snapshot.queryParams['expense_nbr']) {
      this.addExpenseHeader = true;
      this.emptyLines = false;
      this.addLine = true;
      this.showExpenseLine = true;
      this.showExpenseFooter = true;
    } else {
      this.addExpenseHeader = true;
      this.emptyLines = true;
      this.addLine = false;
      this.showExpenseLine = false;
      this.showExpenseFooter = false;
    }
  }
}
