import { IExpenseRecurringKeyModel } from '@shared/models/expenserecurringKey.model';

export interface IExpenseRecurringModel {
  ExpenseRecurringKey: IExpenseRecurringKeyModel;
  company_email: string;
  application_id: string;
  expense_nbr: string;
  expense_final_date: string;
  frequency_nbr: number;
  frequency_period: string;
}
