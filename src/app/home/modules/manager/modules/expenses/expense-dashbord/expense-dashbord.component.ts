import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ExpensesService } from '@core/services/expenses/expenses.service';

@Component({
  selector: 'wid-expense-dashbord',
  templateUrl: './expense-dashbord.component.html',
  styleUrls: ['./expense-dashbord.component.scss']
})
export class ExpenseDashbordComponent implements OnInit {
  single: any[];
  singleArray = [
      {
        'name': 'JAN',
        'value': 50
      },
      {
        'name': 'FEB',
        'value': 20
      },
      {
        'name': 'MA',
        'value': 10
      },
      {
        'name': 'APR',
        'value': 30
      },
    {
      'name': 'MAY',
      'value': 35
    },
    {
      'name': 'JUN',
      'value': 40
    },
    {
      'name': 'JUL',
      'value': 22
    },
    {
      'name': 'AUG',
      'value': 56
    },
    {
      'name': 'SEP',
      'value': 22
    },
    {
      'name': 'OCT',
      'value': 41
    },
    {
      'name': 'NOV',
      'value': 45
    },
    {
      'name': 'DEV',
      'value': 41
    },
    ];
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  companyEmailAddress: string;
  upcomingPaymentList = [];
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
  ) {
    Object.assign(this, { single: this.singleArray });
  }
  ngOnInit(): void {
    this.getConnectedUser();
    this.getRecurringExpense();
    this.getYearsOrMonthsList();
    this.getTVA();
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
    const numberOfDaysFixed = Number((period / frequencyNumber).toFixed());
    let numberOfDays = numberOfDaysFixed;
    const currentDate = new Date();
    while (testDate.getTime() < finalDate.getTime()) {
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
