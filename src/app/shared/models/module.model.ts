import { ModuleKey } from './moduleKey.model';

export interface ModuleModel {
    _id :string;
    ModuleKey: ModuleKey;
  module_desc: string;
  status: string;
}
