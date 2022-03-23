import { ITrainingInviteCollaboratorKey } from '@shared/models/trainingInviteCollaboratorKey.model';

export interface ITrainingInviteCollaborator {
 _id: string;
 TrainingInviteCollaborator: ITrainingInviteCollaboratorKey;
 status_invite: string;
 status: string;
}
