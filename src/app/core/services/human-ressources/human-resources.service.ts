import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBanking } from '@shared/models/banking.model';
import { Observable } from 'rxjs';
import { IIdentityDocument } from '@shared/models/identityDocument.model';
import { IEmergencyContact } from '@shared/models/emergencyContact.model';
import { IChild } from '@shared/models/child.model';
import { IEquipment } from '@shared/models/equipement.model';
import { IEvaluation } from '@shared/models/evaluation.model';
import { IEvaluationGoal } from '@shared/models/evaluationGoal.model';
import { IPayslip } from '@shared/models/payslip.model';
import { ICollaborator } from '@shared/models/collaborator.model';
import { IHrContract } from '@shared/models/hrContract.model';
import { IWorkCertificate } from '@shared/models/workCertificate.model';
import { IHrPreviousContract } from '@shared/models/hrContractPrevious.model';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HumanRessourcesService {

  constructor(private httpClient: HttpClient,

  ) { }
  /*------------------------------------ BANKING --------------------------------------*/
  /**************************************************************************
   * @description Add new Bank
   * @param Bank: Banking Model
   *************************************************************************/
  addBanking(Bank: IBanking): Observable<IBanking> {
    return this.httpClient.post<IBanking>(`${environment.bankingApiUrl}`, Bank);
  }

  /**************************************************************************
   * @description Update Bank
   * @param bank: updated Banking Object
   *************************************************************************/
  updateBanking(bank: any): Observable<any> {
    console.log(bank);
    return this.httpClient.put<IBanking>(`${environment.bankingApiUrl}`, bank);
  }
  /**************************************************************************
   * @description Delete Bank
   * @param email_address: updated Banking Object
   *************************************************************************/
  deleteBanking(email_address: string): Observable<any> {
    return this.httpClient.delete(`${environment.bankingApiUrl}?email_address=${email_address}`);
  }
  /**************************************************************************
   * @description get Banking info by Collaborator ID
   * @param email_address: string
   *************************************************************************/
  getBanking(filter: string): Observable<IBanking[]> {
    return this.httpClient
      .get<IBanking[]>(`${environment.bankingApiUrl}/${filter}`);
  }
  /*------------------------------------ CONTRACT --------------------------------------*/
  /**************************************************************************
   * @description Add new Bank
   * @param contract: Banking Model
   *************************************************************************/
  addContract(contract: IHrContract): Observable<any> {
    return this.httpClient.post<IHrContract>(`${environment.hrContractApiUrl}`, contract);
  }

  /**************************************************************************
   * @description Update Bank
   * @param contract: updated Banking Object
   *************************************************************************/
  updateContract(contract: IHrContract): Observable<any> {
    return this.httpClient.put<IHrContract>(`${environment.hrContractApiUrl}`, contract);
  }
  /**************************************************************************
   * @description Delete Bank
   * @param ID: updated Banking Object
   *************************************************************************/
  disableContract(ID: string): Observable<any> {
    return this.httpClient.delete<IHrContract>(`${environment.hrContractApiUrl}/disable?_id=${ID}`);
  }
  /**************************************************************************
   * @description get Banking info by Collaborator ID
   * @param filter: string
   *************************************************************************/
  getContract(filter: string): Observable<IHrContract[]> {
    return this.httpClient.get<IHrContract[]>(`${environment.hrContractApiUrl}/${filter}`);
  }
  /*------------------------------------ CONTRACT EXTENSION--------------------------------------*/
  /**************************************************************************
   * @description Add new Bank
   * @param contractExtension: Banking Model
   *************************************************************************/
  addContractExtension(contractExtension: IHrContract): Observable<any> {
    return this.httpClient.post<IHrContract>(`${environment.hrContractExtension}`, contractExtension);
  }

  /**************************************************************************
   * @description Update Bank
   * @param contractExtension: updated Banking Object
   *************************************************************************/
  updateContractExtension(contractExtension: IHrContract): Observable<any> {
    return this.httpClient.put<IHrContract>(`${environment.hrContractExtension}`, contractExtension);
  }
  /**************************************************************************
   * @description Delete Contract Extension
   * @param id: deleted Contract Extension Object
   *************************************************************************/
  deleteContractExtension(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.hrContractExtension}?_id=${id}`);
  }
  /**************************************************************************
   * @description get Banking info by Collaborator ID
   * @param email_address: string
   *************************************************************************/
  getContractExtensions(filter: string): Observable<IHrContract[]> {
    return this.httpClient.get<IHrContract[]>(`${environment.hrContractExtension}/${filter}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ CHILD --------------------------------------*/
  /**************************************************************************
   * @description Get Collaborator children list
   * @param filter search query like [ ?id=123 ]
   * @returns All Children Observable<IChild[]>
   *************************************************************************/
  getChildren(filter: string): Observable<IChild[]> {
    return this.httpClient.get<IChild[]>(`${environment.childApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new Child
   * @param child: Child Model
   *************************************************************************/
  addChild(child: IChild): Observable<any> {
    return this.httpClient.post<IChild>(`${environment.childApiUrl}`, child);
  }

  /**************************************************************************
   * @description Update Child
   * @param child: updated Child Object
   *************************************************************************/
  updateChild(child: IChild): Observable<any> {
    return this.httpClient.put<IChild>(`${environment.childApiUrl}`, child);
  }
  /**************************************************************************
   * @description Delete child
   * @param id: deleted child Object
   *************************************************************************/
  deleteChild(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.childApiUrl}?_id=${id}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ IDENTITY DOCUMENT --------------------------------------*/
  /**************************************************************************
   /**
   * @description: http request get to get the collaborator identity document by id
   * @param filter: string
   */
  getIdentityDocument(filter: string): Observable<IIdentityDocument[]> {
    return this.httpClient.get<IIdentityDocument[]>(`${environment.identityDocumentApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new Identity document
   * @param identityDocument: Banking Model
   *************************************************************************/
  addIdentityDocument(identityDocument: IIdentityDocument): Observable<any> {
    return this.httpClient.post<IIdentityDocument>(`${environment.identityDocumentApiUrl}`, identityDocument);
  }

  /**************************************************************************
   * @description Update Identity document
   * @param identityDocument: updated Identity document Object
   *************************************************************************/
  updateIdentityDocument(identityDocument: IIdentityDocument): Observable<any> {
    return this.httpClient.put<IIdentityDocument>(`${environment.identityDocumentApiUrl}`, identityDocument);
  }
  /**************************************************************************
   * @description Delete Identity Document
   * @param id: deleted Identity Document Object
   *************************************************************************/
  deleteIdentityDocument(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.identityDocumentApiUrl}?_id=${id}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ Equipment --------------------------------------*/
  /**************************************************************************
   * @description get equipment
   * @param filter: string
   *************************************************************************/
  getEquipment(filter: string): Observable<IEquipment[]> {
    return this.httpClient.get<IEquipment[]>(`${environment.equipmentApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new emergency contact
   * @param equipment: equipment Model
   *************************************************************************/
  addEquipment(equipment: IEquipment): Observable<any> {
    return this.httpClient.post<IEquipment>(`${environment.equipmentApiUrl}`, equipment);
  }
  /**************************************************************************
   * @description Update Bank
   * @param equipment: updated Equipment Object
   *************************************************************************/
  updateEquipment(equipment: IEquipment): Observable<any> {
    return this.httpClient.put<IEquipment>(`${environment.equipmentApiUrl}`, equipment);
  }
  /**************************************************************************
   * @description Delete Equipment
   * @param id: Delete Equipment
   *************************************************************************/
  deleteEquipment(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.equipmentApiUrl}?_id=${id}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ EMERGENCY CONTACT --------------------------------------*/
  /**************************************************************************
   * @description get Emergency contact by code
   * @param email_adress: string
   *************************************************************************/
  getEmergencyContact(filter: string): Observable<IEmergencyContact[]> {
    return this.httpClient
      .get<IEmergencyContact[]>(`${environment.emergencyContactApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new emergency contact
   * @param emergencyContact: Banking Model
   *************************************************************************/
  addEmergencyContact(emergencyContact: IEmergencyContact): Observable<any> {
    return this.httpClient.post<IEmergencyContact>(`${environment.emergencyContactApiUrl}`, emergencyContact);  }

  /**************************************************************************
   * @description Update Bank
   * @param emergencyContact: updated Banking Object
   *************************************************************************/
  updateEmergencyContact(emergencyContact: IEmergencyContact): Observable<any> {
    return this.httpClient.put<IEmergencyContact>(`${environment.emergencyContactApiUrl}`, emergencyContact);
  }
  /**************************************************************************
   * @description Delete Emergency Contact
   * @param id: Delete Emergency Contact by id
   *************************************************************************/
  deleteEmergencyContact(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.emergencyContactApiUrl}?_id=${id}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ EVALUATION --------------------------------------*/
  /**************************************************************************
   * @description Get Collaborator children list
   * @param filter search query like [ ?id=123 ]
   * @returns All Evaluations Observable<IEvaluation[]>
   *************************************************************************/
  getEvaluations(filter: string): Observable<IEvaluation[]> {
    return this.httpClient.get<IEvaluation[]>(`${environment.evaluationApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new emergency contact
   * @param evaluation: Banking Model
   *************************************************************************/
  addEvaluation(evaluation: IEvaluation): Observable<any> {
    return this.httpClient.post<IEvaluation>(`${environment.evaluationApiUrl}`, evaluation);  }

  /**************************************************************************
   * @description Update Evaluation
   * @param evaluation: updated Evaluation Object
   *************************************************************************/
  updateEvaluation(evaluation: IEvaluation): Observable<any> {
    return this.httpClient.put<IEvaluation>(`${environment.evaluationApiUrl}`, evaluation);
  }
  /**************************************************************************
   * @description Delete Identity Document
   * @param id: Delete Identity DocumentObject
   *************************************************************************/
  deleteEvaluation(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.evaluationApiUrl}?_id=${id}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ EVALUATION GOALS --------------------------------------*/
  /**************************************************************************
   * @description Get evaluation Goals list
   * @param filter search query like [ ?id=123 ]
   * @returns All Evaluation Goals Observable<IEvaluation[]>
   *************************************************************************/
  getEvaluationGoals(filter: string): Observable<IEvaluationGoal[]> {
    return this.httpClient.get<IEvaluationGoal[]>(`${environment.evaluationGoalApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new emergency contact
   * @param evaluationGoal: Banking Model
   *************************************************************************/
  addEvaluationGoal(evaluationGoal: IEvaluationGoal): Observable<any> {
    return this.httpClient.post<IEvaluationGoal>(`${environment.evaluationGoalApiUrl}`, evaluationGoal);  }

  /**************************************************************************
   * @description Update evaluation Goal
   * @param evaluationGoal: updated evaluation Goal
   *************************************************************************/
  updateEvaluationGoal(evaluationGoal: IEvaluationGoal): Observable<any> {
    return this.httpClient.put<IEvaluationGoal>(`${environment.evaluationGoalApiUrl}`, evaluationGoal);
  }
  /**************************************************************************
   * @description DeleteEvaluationGoal
   * @param code: Delete Evaluation Goal object
   *************************************************************************/
  deleteEvaluationGoal(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.evaluationGoalApiUrl}?_id=${id}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ PAYSLIP GOALS --------------------------------------*/
  /**************************************************************************
   * @description Get payslip list
   * @param filter search query like [ ?status= ]
   * @returns All Evaluation Goals Observable<IEvaluation[]>
   *************************************************************************/
  getPayslips(filter: string): Observable<IPayslip[]> {
    return this.httpClient.get<IPayslip[]>(`${environment.payslipApiUrl}/${filter}`);
  }
  /**************************************************************************
   * @description Add new payslip
   * @param payslip: payslip Model
   *************************************************************************/
  addPayslip(payslip: IPayslip): Observable<any> {
    return this.httpClient.post<IPayslip>(`${environment.payslipApiUrl}`, payslip);  }
  /**************************************************************************
   * @description Update payslip
   * @param payslip: updated payslip object
   *************************************************************************/
  updatePayslip(payslip: IPayslip): Observable<any> {
    return this.httpClient.put<IPayslip>(`${environment.payslipApiUrl}`, payslip);
  }
  /**************************************************************************
   * @description get payslip by code
   * @param code: string
   *************************************************************************/
  getPayslip(code: string): Observable<IBanking> {
    return this.httpClient
      .get<IBanking>(`${environment.payslipApiUrl}?payslip_code=${code}`);
  }

  /**************************************************************************
   * @description Enable collaborator Status
   * @param code of the collaborator
   *************************************************************************/
  enablePayslip(code: string): Observable<any> {
    return this.httpClient.put<IPayslip>(`${environment.payslipApiUrl}/enable?payslip_code=${code}`, null);
  }
  /**************************************************************************
   * @description Disable collaborator Status
   * @param code of the collaborator
   *************************************************************************/
  disablePayslip(code: string): Observable<any> {
    return this.httpClient.delete<IPayslip>(`${environment.payslipApiUrl}/disable?payslip_code=${code}`);
  }
  /*-------------------------------------------------------------------------------------*/
  /*------------------------------------ Collaborator --------------------------------------*/
  /**************************************************************************
   * @description Get collaborator List
   * @returns All collaborator <list>
   *************************************************************************/
  getCollaborators(filter: string): Observable<ICollaborator[]> {
    return this.httpClient.get<ICollaborator[]>(`${environment.collaboratorApiUrl}/${filter}` );
  }
  /**************************************************************************
   * @description get Collaborator by ID
   * @param id: string
   *************************************************************************/
  getCollaborator(id: string): Observable<ICollaborator> {
    return this.httpClient
      .get<ICollaborator>(`${environment.collaboratorApiUrl}?_id=${id}`);
  }
  /**************************************************************************
   * @description Add new Collaborator
   * @param collaborator Model
   *************************************************************************/
  addCollaborator(collaborator: ICollaborator): Observable<any> {
    return this.httpClient.post<ICollaborator>(`${environment.collaboratorApiUrl}`, collaborator);
  }

  /**************************************************************************
   * @description Update collaborator
   * @param collaborator updated collaborator Object
   *************************************************************************/
  updateCollaborator(collaborator: ICollaborator): Observable<any> {
    return this.httpClient.put<ICollaborator>(`${environment.collaboratorApiUrl}`, collaborator);
  }

  /**************************************************************************
   * @description Enable collaborator Status
   * @param ID of the collaborator
   *************************************************************************/
  enableCollaborator(ID: string): Observable<any> {
    return this.httpClient.put<ICollaborator>(`${environment.collaboratorApiUrl}/enable?_id=${ID}`, null);
  }

  /**************************************************************************
   * @description Disable collaborator Status
   * @param ID of the collaborator
   *************************************************************************/
  disableCollaborator(ID: string): Observable<any> {
    return this.httpClient.delete<ICollaborator>(`${environment.collaboratorApiUrl}/disable?_id=${ID}`);
  }

  /**************************************************************************
   * @description Enable collaborator Status
   * @param ID of the collaborator
   *************************************************************************/
  enableWorkCertificate(ID: string): Observable<any> {
    return this.httpClient.put<IWorkCertificate>(`${environment.workCertificateApiUrl}/enable?_id=${ID}`, null);
  }
  /**************************************************************************
   * @description Disable collaborator Status
   * @param ID of the collaborator
   *************************************************************************/
  disableWorkCertificate(ID: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.workCertificateApiUrl}/disable?_id=${ID}`);
  }

  getWorkCertificates(filter: string): Observable<IWorkCertificate[]> {
    return this.httpClient.get<IWorkCertificate[]>(`${environment.workCertificateApiUrl}/${filter}` );
  }
  /**************************************************************************
   * @description get Collaborator by ID
   * @param id: string
   *************************************************************************/
  getWorkCertificate(id: string): Observable<IWorkCertificate> {
    return this.httpClient
      .get<IWorkCertificate>(`${environment.workCertificateApiUrl}?_id=${id}`);
  }
  /**************************************************************************
   * @description Add new Collaborator
   * @param collaborator Model
   *************************************************************************/
  addWorkCertificate(certificate: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.workCertificateApiUrl}`, certificate);
  }

  /**************************************************************************
   * @description Update collaborator
   * @param collaborator updated collaborator Object
   *************************************************************************/
  updateWorkCertificate(certificate: any): Observable<any> {
    return this.httpClient.put<any>(`${environment.workCertificateApiUrl}`, certificate);
  }

  /**************************************************************************
   * @description Generate certification
   * @param certificate : certification want to generating
   *************************************************************************/
  generateCertif(certificate: any): Observable<any> {
    return this.httpClient.post<any>(`${environment.pdfFileApiUrl}`, certificate);
  }
  /**************************************************************************
   * @description Delete workcertificate
   * @param id: deleted workcertificate Object
   *************************************************************************/
  deleteWorkCertificate(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.workCertificateApiUrl}?_id=${id}`);
  }

  /**************************************************************************
   * @description Add new PreviousContract
   * @param PreviousContract: IHrPreviousContract
   *************************************************************************/
  addPreviousContract(PreviousContract: IHrPreviousContract): Observable<any> {
    return this.httpClient.post<IEvaluation>(`${environment.hrPreviousContractApiUrl}`, PreviousContract);  }

  /**************************************************************************
   * @description Update PreviousContract
   * @param PreviousContract updated IHrPreviousContract
   *************************************************************************/
  updatePreviousContract(PreviousContract: any): Observable<any> {
    return this.httpClient.put<any>(`${environment.hrPreviousContractApiUrl}`, PreviousContract);
  }
  /**************************************************************************
   * @description Delete PreviousContract
   * @param id: deleted PreviousContract Object
   *************************************************************************/
  deletePreviousContract(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.hrPreviousContractApiUrl}?_id=${id}`);
  }
  /**************************************************************************
   * @description Get PreviousContract
   * @param filter: string
   * @return IHrPreviousContract[]
   *************************************************************************/
  getPreviousContracts(filter: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.hrPreviousContractApiUrl}/${filter}` );
  }
  /**************************************************************************
   * @description Delete previous contract
   * @param ID: make previous contract disable
   *************************************************************************/
  disablePreviousContracts(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.hrPreviousContractApiUrl}/disable?_id=${id}` );
  }
  /**************************************************************************
   * @description Active previous contract
   * @param id: make previous contract enable
   *************************************************************************/
  enablePreviousContracts(id: string): Observable<any> {
    return this.httpClient.put<any>(`${environment.hrPreviousContractApiUrl}/enable?_id=${id}`, null);
  }

}
