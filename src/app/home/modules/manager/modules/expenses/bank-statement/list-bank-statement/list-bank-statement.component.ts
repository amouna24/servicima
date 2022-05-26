import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';

import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ExpensesService } from '@core/services/expenses/expenses.service';
import { environment } from '@environment/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'wid-list-bank-statement',
  templateUrl: './list-bank-statement.component.html',
  styleUrls: ['./list-bank-statement.component.scss']
})
export class ListBankStatementComponent implements OnInit, OnDestroy {

  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  emailAddress: string;
  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);
  private subscriptions: Subscription[] = [];
  constructor(private utilService: UtilsService,
              private userService: UserService,
              private modalService: ModalService,
              private snackBar: MatSnackBar,
              private expenseService: ExpensesService, ) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.isLoading.next(true);
    this.getConnectedUser();
    this.getAllBankStatement(this.nbtItems.getValue(), 0);
  }

  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    this.getAllBankStatement(params.limit, params.offset);
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  /**
   * @description get all bank statement by company
   */
  getAllBankStatement(limit: number, offset: number) {
    // tslint:disable-next-line:max-line-length
    this.subscriptions.push(this.expenseService.getBankStatementList(`?company_email=${this.emailAddress}&beginning=${offset}&number=${limit}`).subscribe((data) => {
      this.ELEMENT_DATA.next(data);
      this.isLoading.next(false);
    }, error => console.error(error)));
  }

  /**
   * @description : action
   * @param rowAction: object
   */
  switchAction(rowAction: any) {
    switch (rowAction.actionType.name) {
      /* case ('show'): this.showUser(rowAction.data);
        break; */
      case ('update'): this.updateTax(rowAction.data);
        break;
      case ('showAttachement'): this.showAttachement(rowAction.data);
        break;
       case('company.tax.management.delete'): this.deleteBankStatement(rowAction.data);
    }
  }

  /**
   * @description : action
   * @param delete: object
   */
  deleteBankStatement(data) {
    data.map((el) => {
      this.expenseService.deleteBankStatement(el._id).subscribe((res) => {
        this.getAllBankStatement(this.nbtItems.getValue(), 0 );
      });
    });
  }

  /**
   * @description : update BankStatement
   * @param data: object to update
   */
  updateTax(data) {

    const queryObject = {
      bank_statement_code: data.BankStatementKey.bank_statement_code
    };
    this.utilService.navigateWithQueryParam('/manager/expenses/add-bank-statement', queryObject);
  }
  showAttachement(data) {
    if (data['attachment']) {
      window.open(environment.uploadFileApiUrl + '/show/' + data['attachment']);
    } else {
      this.snackBar.open('not found', 'Undo', {
        duration: 3000
      });
    }

  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
