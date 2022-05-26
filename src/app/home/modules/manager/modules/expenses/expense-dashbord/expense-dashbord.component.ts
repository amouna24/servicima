import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ExpensesService } from '@core/services/expenses/expenses.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wid-expense-dashbord',
  templateUrl: './expense-dashbord.component.html',
  styleUrls: ['./expense-dashbord.component.scss']
})
export class ExpenseDashbordComponent implements OnInit {
  single: any[];
  isLoading = new BehaviorSubject<boolean>(true);
  resGraph = { };
  years: number;
  totalVatInvoice = 0;
  monthNames = [ 'JAN', 'FEB', 'MA', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  companyEmailAddress: string;
  upcomingPaymentList = [];
  listYears: any;
  sumCollected = 12000;
  colorScheme = {
    domain: ['#147ad6']
  };
  period = 'year';
  listOfMonthsOrYears = [];
  yearGraph = new Date().getFullYear();
  selectedYearOrMonth: string;
  sumTva: number;
  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
    private expenseService: ExpensesService,
    private invoiceService: InvoiceService
  ) {

  }
  ngOnInit(): void {
    this.isLoading.next(true);
    this.getConnectedUser();

    this.getRecurringExpense();

    this.getYearsOrMonthsList();
    this.getTVA();
    this.getInvoiceByYear(new Date().getFullYear());
    this.invoiceService.getInvoiceListYears('?company_email=dhia.othmen@widigital-group.com').subscribe((data) => {
      this.listYears = data;
    });
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
  getInvoiceByYear(year) {
    this.years = year;
    const res = 0;

    const ob = { 'JAN': 0, 'FEB': 0, 'MA': 0, 'APR': 0, 'MAY': 0, 'JUN': 0, 'JUL': 0,
     'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0};

    this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmailAddress}&year_date=${year}`).subscribe((data) => {

      if (data['results'].length > 0) {
        data['results'].map((invoice) => {
          ob[this.monthNames[new Date(invoice.invoice_date).getMonth()]] =
            invoice.invoice_total_amount + (ob[this.monthNames[new Date(invoice.invoice_date).getMonth()]] ) ;
        });
      }
      const sp = [];
      const entries = Object.entries(ob);
      entries.map((invoice) => {
        const listInvoice = { };
        listInvoice['name'] = invoice[0];
        listInvoice['value'] = Number(invoice[1]) ;
        sp.push(listInvoice);
      });
      this.resGraph = sp;
      Object.assign(this, { single: this.resGraph });
      this.isLoading.next(false);
    });

  }

  getRecurringExpense() {
    this.expenseService.getExpenseHeader(`?company_email=${
      this.companyEmailAddress}&application_id=${
      this.utilsService.getApplicationID('SERVICIMA')}&expense_type=recurring&status=true`)
      .subscribe((expenseHeader) => {
        if (expenseHeader['msg_code'] !== '0004') {
          expenseHeader.map((oneExpenseHeader) =>  {
            this.expenseService.getExpenseRecurring(`?expense_nbr=${oneExpenseHeader.ExpenseHeaderKey.expense_nbr}`)
              .subscribe((recuringExpense) => {
                this.expenseService.getExpenseLine(`?expense_nbr=${oneExpenseHeader.ExpenseHeaderKey.expense_nbr}`)
                  .subscribe((expenseLine) => {
                    let sumPrices = 0;
                    expenseLine.map((oneLine) => {
                      sumPrices = Number(
                        (Number(oneLine.price_without_vat) + ((Number(oneLine.vat) * 100) / Number(oneLine.price_without_vat)))
                          .toFixed(1));
                    });
                    const currentDate = new Date();
                    const expenseFinalDate = new Date(recuringExpense[0].expense_final_date);
                    const expenseStartDate = new Date(oneExpenseHeader.expense_date);
                    if (currentDate.getTime() < expenseFinalDate.getTime()) {
                      this.upcomingPaymentList.push({
                        date: this.getUpcomingDate(
                          expenseStartDate,
                          expenseFinalDate,
                          recuringExpense[0].frequency_period,
                          recuringExpense[0].frequency_nbr),
                        supplier_name: oneExpenseHeader.supplier_name,
                        price: sumPrices,
                      });
                    }
                  });
              });
          });
        }
    });
  }
  getUpcomingDate(startDate, finalDate, frequencyPeriod, frequencyNumber) {
    let period;
    const testDate = startDate;
    let resultDate = finalDate;
    if (frequencyPeriod === 'month') {
      period = 30;
    } else {
      period = 365;
    }
    const numberOfDaysFixed = Number((period / frequencyNumber));
    let numberOfDays = numberOfDaysFixed;
    const currentDate = new Date();
    while (new Date(testDate.setDate( testDate.getDate() + Number(numberOfDays))).getTime() < finalDate.getTime()) {
      const newDate = new Date(testDate.setDate( testDate.getDate() + Number(numberOfDays)));
      numberOfDays += numberOfDaysFixed;
      if (currentDate.getTime() < newDate.getTime() && resultDate.getTime() > newDate.getTime()) {
        resultDate = newDate;
      }
    }
    return resultDate;
  }
  getYearsOrMonthsList() {
    if (this.period === 'year') {
      const yearsList = [];
     for (let i = 0;  i <= 10; i++) {
        yearsList.push(new Date().getFullYear() + i);
      }
      this.listOfMonthsOrYears = yearsList;
    } else {
      this.listOfMonthsOrYears = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    this.selectedYearOrMonth = this.listOfMonthsOrYears[0];

   }
  getTVA() {
   let res = 0;
   this.totalVatInvoice = 0;
    let listInvoice = [];

if (this.monthNames.includes(this.selectedYearOrMonth)) {
  this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmailAddress}&year_date=${new Date().getFullYear()}`).subscribe((data) => {

    if (data['results'].length > 0) {
      listInvoice =  data['results'].filter((el) => {
        if (new Date(el.invoice_date).getMonth() ===  this.listOfMonthsOrYears.findIndex(els => els === this.selectedYearOrMonth)) {
          return el;
        }
      });
    }
    listInvoice.map((l) => {
      res = l.vat_amount + res;
    });
    this.totalVatInvoice = res;
  });

} else {
  this.invoiceService.getInvoiceHeader(`?company_email=${this.companyEmailAddress}&year_date=${this.selectedYearOrMonth}`).subscribe((data) => {

    if (data['results'].length > 0) {
      listInvoice = data['results'].filter((el) => {
        res = res + el.vat_amount;
      });
      this.totalVatInvoice = res;
    }
  });
}

    /* invoice statement */

    this.sumTva = 0;
    this.expenseService.getExpenseHeader(`?company_email=${
      this.companyEmailAddress}&application_id=${
      this.utilsService.getApplicationID('SERVICIMA')}&expense_type=normal&status=true`)
      .subscribe((expenseHeaderList) => {
        expenseHeaderList.map( (oneHeader) => {
          if (this.period === 'year') {
            if (new Date(oneHeader.expense_date).getFullYear() === Number(this.selectedYearOrMonth)) {
              this.expenseService.getExpenseLine(`?expense_nbr=${oneHeader.ExpenseHeaderKey.expense_nbr}&`)
                .subscribe((line) => {
                  line.map( (oneLine) => {
                    this.sumTva += Number(Number(Number(oneLine.vat) * Number(oneLine.price_without_vat) / 100).toFixed(1));
                  });
                });
            }
          } else {
            if (new Date(oneHeader.expense_date).getFullYear() === new Date().getFullYear()
              &&
              new Date(oneHeader.expense_date).getMonth() === this.listOfMonthsOrYears.indexOf(this.selectedYearOrMonth)) {
              this.expenseService.getExpenseLine(`?expense_nbr=${oneHeader.ExpenseHeaderKey.expense_nbr}`)
                .subscribe((line) => {
                  line.map( (oneLine) => {
                    this.sumTva += Number(Number(Number(oneLine.vat) * Number(oneLine.price_without_vat) / 100).toFixed(1));
                  });
                });
            }
          }
        });
      });
  }
}
