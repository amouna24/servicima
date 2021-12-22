import { IAssociatePayslipKey } from '@shared/models/associatePayslipKey.model';

export interface IAssociatePayslip {
  _id?: string;
  payslipKey: IAssociatePayslipKey;
  file_name: string;
  month: string;
  year: string;
  status?: string;
}
