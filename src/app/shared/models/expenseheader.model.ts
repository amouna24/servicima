export interface IExpenseHeaderModel {
  ExpenseHeaderKey?: IExpenseHeaderModel;
  company_email: string;
  application_id: string;
  expense_title: string;
  email_address: string;
  expense_nbr: number;
  supplier_name: string;
  tax_code: string;
  expense_date: string;
  status: boolean;
  expense_description: string;
  expense_type: string;
  attachment: string;
}
