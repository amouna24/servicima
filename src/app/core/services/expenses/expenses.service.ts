import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITestQuestionModel } from '@shared/models/testQuestion.model';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { IExpenseHeaderModel } from '@shared/models/expenseheader.model';
import { IExpenseLineModel } from '@shared/models/expenseline.model';
import { IExpenseFooterModel } from '@shared/models/expensefooter.model';
import { IExpenseRecurringModel } from '@shared/models/expenserecurring.model';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**************************************************************************
   * @description Get expenseHeader List
   * @param filter search query like [ ?id=123 ]
   * @returns All expenseHeader Observable<IExpenseHeaderModel[]>
   *************************************************************************/
  getExpenseHeader(filter: string): Observable<IExpenseHeaderModel[]> {
    return this.httpClient.get<IExpenseHeaderModel[]>(`${environment.expensesHeaderApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new ExpenseHeader
   * @param  expenseHeader: expenseHeader Model
   *************************************************************************/
  addExpenseHeader(expenseHeader: IExpenseHeaderModel): Observable<any> {
    return this.httpClient.post<IExpenseHeaderModel>(`${environment.expensesHeaderApiUrl}`, expenseHeader);
  }
/**************************************
* @description Update Expense Status
* @param expenseHeader: updated expenseHeader Object
*************************************************************************/
  updateExpenseHeader(expenseHeader: IExpenseHeaderModel): Observable<any> {
    return this.httpClient.put<IExpenseHeaderModel>(`${environment.expensesHeaderApiUrl}`, expenseHeader);
  }
  /**************************************************************************
   * @description Delete Expense Header Status
   * @param id: Delete Expense HeaderObject
   *************************************************************************/
  deleteExpenseHeader(id: string): Observable<any> {
    return this.httpClient.delete<IExpenseHeaderModel>(`${environment.expensesHeaderApiUrl}/?_id=${id}`);
  }
  /**************************************************************************
   * @description Get ExpenseLine List
   * @param filter search query like [ ?id=123 ]
   * @returns All ExpenseLine Observable<IExpenseLineModel[]>
   *************************************************************************/
  getExpenseLine(filter: string): Observable<IExpenseLineModel[]> {
    return this.httpClient.get<IExpenseLineModel[]>(`${environment.expensesLineApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new ExpenseLine
   * @param  expenseLine: ExpenseLine Model
   *************************************************************************/
  addExpenseLine(expenseLine: IExpenseLineModel): Observable<any> {
    return this.httpClient.post<IExpenseLineModel>(`${environment.expensesLineApiUrl}`, expenseLine);
  }
  /**************************************
   * @description Update ExpenseLine Status
   * @param expenseLine: updated ExpenseLine Object
   *************************************************************************/
  updateExpenseLine(expenseLine: IExpenseLineModel): Observable<any> {
    return this.httpClient.put<IExpenseLineModel>(`${environment.expensesLineApiUrl}`, expenseLine);
  }
  /**************************************************************************
   * @description Delete Expense Line Status
   * @param id: Delete Expense Line Object
   *************************************************************************/
  deleteExpenseLine(id: string): Observable<any> {
    return this.httpClient.delete<IExpenseLineModel>(`${environment.expensesLineApiUrl}/?_id=${id}`);
  }
  /**************************************************************************
   * @description Get ExpenseFooter List
   * @param filter search query like [ ?id=123 ]
   * @returns All ExpenseFooter Observable<IExpenseFooterModel[]>
   *************************************************************************/
  getExpenseFooter(filter: string): Observable<IExpenseFooterModel[]> {
    return this.httpClient.get<IExpenseFooterModel[]>(`${environment.expensesFooterApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new ExpenseFooter
   * @param  expenseFooter: ExpenseFooter Model
   *************************************************************************/
  addExpenseFooter(expenseFooter: IExpenseFooterModel): Observable<any> {
    return this.httpClient.post<IExpenseFooterModel>(`${environment.expensesFooterApiUrl}`, expenseFooter);
  }
  /**************************************
   * @description Update ExpenseFooter Status
   * @param expenseFooter: updated ExpenseFooter Object
   *************************************************************************/
  updateExpenseFooter(expenseFooter: IExpenseFooterModel): Observable<any> {
    return this.httpClient.put<IExpenseFooterModel>(`${environment.expensesFooterApiUrl}`, expenseFooter);
  }
  /**************************************************************************
   * @description Delete Expense Footer Status
   * @param id: Delete Expense Footer Object
   *************************************************************************/
  deleteExpenseFooter(id: string): Observable<any> {
    return this.httpClient.delete<IExpenseFooterModel>(`${environment.expensesFooterApiUrl}/?_id=${id}`);
  }
  /**************************************************************************
   * @description Get ExpenseRecurring List
   * @param filter search query like [ ?id=123 ]
   * @returns All ExpenseRecurring Observable<IExpenseRecurringModel[]>
   *************************************************************************/
  getExpenseRecurring(filter: string): Observable<IExpenseRecurringModel[]> {
    return this.httpClient.get<IExpenseRecurringModel[]>(`${environment.expensesRecurringApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new ExpenseRecurring
   * @param  expenseRecurring: ExpenseRecurring Model
   *************************************************************************/
  addExpenseRecurring(expenseRecurring: IExpenseRecurringModel): Observable<any> {
    return this.httpClient.post<IExpenseRecurringModel>(`${environment.expensesRecurringApiUrl}`, expenseRecurring);
  }
  /**************************************
   * @description Update ExpenseRecurring Status
   * @param expenseRecurring: updated ExpenseRecurring Object
   *************************************************************************/
  updateExpenseRecurring(expenseRecurring: IExpenseRecurringModel): Observable<any> {
    return this.httpClient.put<IExpenseRecurringModel>(`${environment.expensesRecurringApiUrl}`, expenseRecurring);
  }
  /**************************************************************************
   * @description Delete Expense Recurring Status
   * @param id: Delete Expense Recurring Object
   *************************************************************************/
  deleteExpenseRecurring(id: string): Observable<any> {
    return this.httpClient.delete<IExpenseRecurringModel>(`${environment.expensesRecurringApiUrl}/?_id=${id}`);
  }
  /**************************************************************************
   * @description Get ExpenseLine List
   * @param filter search query like [ ?id=123 ]
   * @returns All ExpenseLine Observable<IExpenseLineModel[]>
   *************************************************************************/
  getExpenseHeaderDataTable(filter: string): Observable<IExpenseHeaderModel[]> {
    return this.httpClient.get<IExpenseHeaderModel[]>(`${environment.expensesHeaderApiUrl}/datatable/${filter}`);
  }

  /**************************************************************************
   * @description Get BankStatement List
   * @param filter search query like [ ?id=123 ]
   * @returns All BankStatement Observable<BankStatement[]>
   *************************************************************************/
  getBankStatement(filter: string): Observable<any> {
    return this.httpClient.get<IExpenseHeaderModel[]>(`${environment.bankStatementApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new BankStatement
   * @param  BankStatement: BankStatement Model
   *************************************************************************/
  addBankStatement(BankStatement): Observable<any> {
    return this.httpClient.post(`${environment.bankStatementApiUrl}`, BankStatement);
  }
  /**************************************
   * @description Update BankStatement Status
   * @param BankStatement: updated BankStatement Object
   *************************************************************************/
  updateBankStatement(BankStatement): Observable<any> {
    return this.httpClient.put(`${environment.bankStatementApiUrl}`, BankStatement);
  }
  /**************************************************************************
   * @description Delete BankStatement Status
   * @param id: Delete BankStatement Object
   *************************************************************************/
  deleteBankStatement(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.bankStatementApiUrl}/?_id=${id}`);
  }

  /**************************************************************************
   * @description Get BankStatement List
   * @param filter search query like [ ?id=123 ]
   * @returns All BankStatement Observableany>
   *************************************************************************/
  getBankStatementList(filter: string): Observable<IExpenseHeaderModel[]> {
    return this.httpClient.get<IExpenseHeaderModel[]>(`${environment.bankStatementApiUrl}/datatable/${filter}`);
  }
}
