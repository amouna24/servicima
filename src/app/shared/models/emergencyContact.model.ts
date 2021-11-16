import { IEmergencyContactKey } from '@shared/models/emergencyContactKey.model';

export interface IEmergencyContact {
  /* ID */
  HREmergencyContactKey?: IEmergencyContactKey;
  _id: string;
  full_name?: string;
  phone?: string;
}
