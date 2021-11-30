import { IEquipmentKey } from '@shared/models/equipementKey.model';

export interface IEquipment {
  /* ID */
  HREquipmentKey: IEquipmentKey;
  _id: string;
  equipment_name: string;
}
