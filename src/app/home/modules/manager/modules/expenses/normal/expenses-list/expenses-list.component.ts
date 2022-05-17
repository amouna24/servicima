import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExpensesService } from '@core/services/expenses/expenses.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  @Input() tableData = new BehaviorSubject<any>([]);
  nbtItems = new BehaviorSubject<number>(5);
  companyEmailAddress: string;

  constructor(
    private expensesService: ExpensesService,
    private userService: UserService,
    private utilsService: UtilsService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.getConnectedUser();
    await this.getData(0, this.nbtItems.getValue()).then((result: any[]) => {
      this.tableData.next(result);
      this.isLoading.next(false);
    });
  }

  switchAction(rowAction: any) {
    switch (rowAction.actionType.name) {
      case ('update'):
        this.updateExpense(rowAction.data);
        break;
      case('Archive expense'):
        this.archiveExpense(rowAction.data);
        break;
    }
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getData(params.offset, params.limit).then((result: any[]) => {
      this.tableData.next(result);
      this.isLoading.next(false);
    });
  }

  getData(offset, limit) {
    this.isLoading.next(true);
    const expenseList = [];
    return new Promise((resolve) => {
      this.expensesService.getExpenseHeaderDataTable(`?company_email=${
        this.companyEmailAddress}&application_id=${
        this.utilsService.getApplicationID('SERVICIMA')}&expense_type=normal&status=true&beginning=${
        offset}&number=${
        limit}`).subscribe((expenseHeader) => {
        const expenseHeaderList = [...expenseHeader['results']];
        if (expenseHeader['msg_code'] !== '0004') {
          expenseHeaderList.map((oneExpenseHeader) => {
            this.expensesService.getExpenseLine(`?company_email=${
              this.companyEmailAddress}&application_id=${
              this.utilsService.getApplicationID('SERVICIMA')}&expense_nbr=${
              oneExpenseHeader.ExpenseHeaderKey.expense_nbr.toString()}`)
              .subscribe((expenseLineList) => {
                let tvaTotal = 0;
                let sumTotal = 0;
                if (expenseLineList['msg_code'] !== '0004') {
                  expenseLineList.map((oneExpenseLine) => {
                    tvaTotal += Number(oneExpenseLine.vat);
                    sumTotal += Number(oneExpenseLine.price_without_vat);
                  });
                }
                expenseList.push({
                  expense_nbr: oneExpenseHeader.ExpenseHeaderKey.expense_nbr,
                  total: sumTotal + ' $',
                  tva: tvaTotal + ' $',
                  date: oneExpenseHeader.expense_date,
                  supplier: oneExpenseHeader.supplier_name,
                  creator: oneExpenseHeader.ExpenseHeaderKey.email_address
                });
                if (expenseHeaderList.length === expenseList.length) {
                  expenseHeader['results'] = expenseList;
                  resolve(expenseHeader);
                }
              });
          });

        } else {
          this.isLoading.next(false);
          resolve([]);
        }
      });
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

  private updateExpense(data) {
    const queryObject = {
      expense_nbr: data.expense_nbr
    };
    this.utilsService.navigateWithQueryParam('/manager/expenses/expenses-normal/expense-add', queryObject);
  }

  archiveExpense(data) {
    data.map((expenseNbr) => {
      this.expensesService.getExpenseHeader(`?company_email=${
        this.companyEmailAddress}&expense_nbr=${expenseNbr.expense_nbr}`).subscribe((expenseHeader) => {
        const expenseHeaderObject = expenseHeader[0];
        expenseHeaderObject.status = false;
        expenseHeaderObject.company_email = this.companyEmailAddress;
        expenseHeaderObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
        expenseHeaderObject.expense_nbr = expenseNbr.expense_nbr;
        expenseHeaderObject.email_address = expenseHeader[0].ExpenseHeaderKey.email_address;
        this.expensesService.updateExpenseHeader(expenseHeaderObject).subscribe((updatedExpenseHeader) => {
          this.getData(0, this.nbtItems.getValue()).then((result: any[]) => {
            this.tableData.next(result);
            this.isLoading.next(false);
          });
        });
      });
    });
  }
}
