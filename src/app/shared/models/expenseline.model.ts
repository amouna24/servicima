export interface IExpenseLineModel {
  _id?: string;
  company_email: string;
  application_id: string;
  expense_line_code: string;
  expense_nbr: string;
  expense_product_title: string;
  expense_line_description: string;
  price_without_vat: string;
  quantity: string;
  vat: string;
}
