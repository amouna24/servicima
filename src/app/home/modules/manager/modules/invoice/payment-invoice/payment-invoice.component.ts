import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';

@Component({
  selector: 'wid-payment-invoice',
  templateUrl: './payment-invoice.component.html',
  styleUrls: ['./payment-invoice.component.scss']
})
export class PaymentInvoiceComponent implements OnInit {

  invoice = true;
  mailingForm: FormGroup;
  selectedItems = [];
  paymentMethodsList = [];
  companyId: string;
  applicationId: string;
  companyEmail: string;
  emailAddress: string;
  minDateWithFormat: any;
  public filteredPaymentMethods = new ReplaySubject(1);
  constructor(
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private refDataService: RefdataService,
    private userService: UserService,
    private utilsService: UtilsService,
    private invoiceService: InvoiceService,
    public  dialogRef: MatDialogRef<PaymentInvoiceComponent>
  ) {
    this.minDateWithFormat = new Date(this.data.minDate).toISOString().split('.')[0];
  }

  async ngOnInit(): Promise<void> {
    this.getConnectedUser();
    this.applicationId = this.userService.applicationId;
    this.initializeForm();
    await this.getRefData();
  }
  initializeForm() {
    this.mailingForm = this.fb.group( {
      paymentDate: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      message: ['', [Validators.required]],
      bankAccount: [''],
      paymentMethodsCtrl: ['', [Validators.required]],
      paymentMethodsFilterCtrl: [''],
    });
  }
  getConnectedUser() {
    this.userService.connectedUser$.subscribe(async (data) => {
      if (!!data) {
        this.companyId = data['company'][0]['_id'];
        this.companyEmail = data['company'][0]['companyKey']['email_address'];
        this.emailAddress = data['user'][0]['userKey']['email_address'];
      }
    });
  }

  /**
   * @description : get the refData from appInitializer service and mapping data
   */
  async getRefData() {
    const list = ['PAYMENT_MODE'];
    const refData = await this.refDataService.getRefData(this.companyId, this.applicationId,
      list);
    this.paymentMethodsList = refData['PAYMENT_MODE'];

    this.filteredPaymentMethods.next(this.paymentMethodsList.slice());
    this.utilsService.changeValueField(this.paymentMethodsList, this.mailingForm.controls.paymentMethodsFilterCtrl, this.filteredPaymentMethods);
  }

  /**
   * @description : send mail
   */
  sendMail() {
  }

  /**
   * @description : add payment mode
   */
  addPaymentMode() {
    this.router.navigate(['/manager/settings/payment-methods']);
    this.dialogRef.close();
  }

  addInvoicepayment() {
    const invoicePayment = {
      application_id           : this.applicationId,
      company_email            : this.companyEmail,
      invoice_nbr              : this.data.invoice_nbr,
      payment_date             : this.mailingForm.value.paymentDate ? this.mailingForm.value.paymentDate  : new Date(),
      invoice_line_unit_amount : this.mailingForm.value.amount,
      bank_account             : this.mailingForm.value.bankAccount,
      payment_mode             : this.mailingForm.value.paymentMethodsCtrl,
      note                     : this.mailingForm.value.message,
      entered_by               : this.emailAddress,
    };
   this.dialogRef.close(invoicePayment);

  }

}
