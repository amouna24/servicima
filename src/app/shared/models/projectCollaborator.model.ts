import { IProjectCollaboratorKey } from '@shared/models/projectCollaboratorKey.model';

export interface IProjectCollaborator {
  /* ID */
  _id?: string;
  ProjectCollaboratorKey?: IProjectCollaboratorKey;
  start_date: Date;
  end_date?: Date;

  contract_project_code?: number;
  email_address: string;
}
