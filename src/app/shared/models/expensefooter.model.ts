import { IExpenseFooterKeyModel } from '@shared/models/expensefooterKey.model';

export interface IExpenseFooterModel {
  _id?: string;
  ExpenseHeaderKey: IExpenseFooterKeyModel;
  company_email: string;
  application_id: string;
  expense_nbr: string;
  expense_comment: string;
}
