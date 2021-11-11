import { IPayslipKey } from './payslipKey.model';
export interface IPayslip {
  payslipKey: IPayslipKey;
  month: string;
  start_date: string;
  end_date: string;
  basic_pay: string;
  taxes: string;
  document: string;
  status: string;
}
