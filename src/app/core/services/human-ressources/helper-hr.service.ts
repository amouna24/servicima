// tslint:disable-next-line:origin-ordered-imports
import { Injectable } from '@angular/core';
import { AppInitializerService } from '../app-initializer/app-initializer.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { UtilsService } from '../utils/utils.service';
import { HumanRessourcesService } from './human-resources.service';
// tslint:disable-next-line:origin-ordered-imports
import { ICollaborator } from '@shared/models/collaborator.model';
// tslint:disable-next-line:origin-ordered-imports
import { takeUntil } from 'rxjs/operators';
// tslint:disable-next-line:origin-ordered-imports
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HelperHrService {

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private appInitializerService: AppInitializerService,
    private utilsService: UtilsService,
    private hrService: HumanRessourcesService,
    private localStorage: LocalStorageService
  ) { }
  cred = this.localStorage.getItem('userCredentials');
  applicationId = this.cred['application_id'];

  /**************************************************************************
   * @description Get countries
   *************************************************************************/
  getCountries(countries, input, filterCountriesList) {
    this.appInitializerService.countriesList.forEach((country) => {
      countries.push({ value : country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC});
    });
    this.utilsService.changeValueField(
      countries,
      input,
      filterCountriesList
    );
  }
  /**************************************************************************
   * @description Get nationnalities
   *************************************************************************/
  getNationalities(nationalities, lang, input, filterNationalitiesList) {
    this.utilsService.getNationality(this.utilsService.getCodeLanguage(lang)).map((nationality) => {
      nationalities.push({ value: nationality.NATIONALITY_CODE, viewValue: nationality.NATIONALITY_DESC });
    });
    filterNationalitiesList.next(nationalities.slice());
    this.utilsService.changeValueField(
      nationalities,
      input,
      filterNationalitiesList
    );
  }
  /**************************************************************************
   * @description Get emergency contact
   *************************************************************************/
  getEmergencyContact(emergencyContactList, email) {
    this.hrService.getEmergencyContact(`?application_id=${this.cred['application_id']}&email_address=${email}`)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(
        info => {
          if (info['msg_code'] === '0004' ) {

          } else {

            emergencyContactList.next(info);
          }
        },
        error => {
          console.log('error hrService', error.error.msg_code );
          if (error.error.msg_code === '0004') {

          }
        }
      );
  }
  /**************************************************************************
   * @description Get banking info
   *************************************************************************/
  getBanking(banking, email) {
    this.hrService.getBanking(`?application_id=${this.cred['application_id']}&email_address=${email}`)
      // tslint:disable-next-line:no-shadowed-variable
      .subscribe(
        data => {
          if (data['msg_code'] === '0004' ) {

          } else {
            banking = data;
          }
        },
        error => {
          console.log('error hrService', error.error.msg_code );
          if (error.error.msg_code === '0004') {
          }
        }
      );
  }
  /**************************************************************************
   * @description Get Equipment
   *************************************************************************/
  getEquipment(equipmentList, email) {
    this.hrService.getEquipment(`?application_id=${this.cred['application_id']}&email_address=${email}`)
      .subscribe(
        data => {
          if (data['msg_code'] === '0004' ) {
            console.log('No data found');
          } else {
            console.log(data);
            equipmentList.next(data);
          }
        },
        error => console.log(error)
      );
  }
  /**************************************************************************
   * @description Get identityDocument
   *************************************************************************/
  getIdentityDocument(identityDocumentList, email) {
    this.hrService.getIdentityDocument(`?application_id=${this.cred['application_id']}&email_address=${email}`)
      .subscribe(
        data => {
          if (data['msg_code'] === '0004' ) {

          } else {
            identityDocumentList.next(data);
          }
        },
        error => console.log(error)
      );
  }
  updateCollaboratorInfo(collaborator: ICollaborator) {
    this.hrService.updateCollaborator(collaborator)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          console.log('Collabrator updated successfully', res);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  /**************************************************************************
   * @description Add/Update Banking Info
   *************************************************************************/
  addOrUpdateBanking(bankingCheck: boolean, banking: any, applicationId: string, email_address) {
    banking.email_address = email_address;
    banking.application_id = applicationId;
    if (bankingCheck) {
      this.hrService.updateBanking(banking)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp) => {
            console.log('Banking informations updated successfully', resp);
          },
          error => {
            console.log('error', error);
          }
          // tslint:disable-next-line:no-unused-expression
        );
    } else if (!banking._id) {
      this.hrService.addBanking(banking)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp) => {
            console.log('Banking informations added successfully', resp);
          },
          error => {
            console.log('error', error);
          }
        );
    }

  }
  /**************************************************************************
   * @description Add/Update Contract
   *************************************************************************/
  addOrUpdateContract(contractCheck: boolean, contract: any, applicationId: string, email_address: any, collaboratorEmail: any, contract_type: any) {
    contract['contract_type'] =  contract.contract_type ? contract_type : contract.HRContractKey?.contract_type;
    // tslint:disable-next-line:max-line-length
    if (contractCheck === true && contract._id !== '') {
      this.hrService.updateContract(contract)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp) => {
            console.log('Contract informations updated successfully', resp);
          },
          error => {
            console.log('error', error);
          }
          // tslint:disable-next-line:no-unused-expression
        );
    } else if (contract['contract_type']) {
      this.hrService.addContract(contract)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp) => {
            console.log('Contract informations added successfully', resp);
          },
          error => {
            console.log('error', error);
          }
        );
    } else {
      this.utilsService.openSnackBar('Contract type not found', 'close');

    }

  }
  /**************************************************************************
   * @description Add/Update Equipment info
   *************************************************************************/
  addOrUpdateEquipement(equipementCheck: boolean, equipment: any, applicationId: string, emailAddress: string, code: string) {
    equipment.equipment_code = code ? code : equipment.HREquipmentKey.equipment_code;
    equipment.email_address = emailAddress;
    equipment.application_id = applicationId;
    console.log(equipment);
    if (equipementCheck && equipment._id) {
      this.hrService.updateEquipment(equipment)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('Equipment updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!equipment._id) {
      this.hrService.addEquipment(equipment).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('equipment added successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    }
  }
  /**************************************************************************
   * @description Add/Update Emergency Contact info
   *************************************************************************/
  addOrUpdateEmergencyContact(emergencyCheck: boolean, emergencyContact: any, applicationId: string, emailAddress: string, code: string) {
    emergencyContact.contact_code = code ? code : emergencyContact.HREmergencyContactKey.contact_code ;
    emergencyContact.application_id = applicationId;
    emergencyContact.email_address = emailAddress;
    console.log(emergencyContact);
    if (emergencyCheck && emergencyContact._id ) {
      this.hrService.updateEmergencyContact(emergencyContact)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('Contact updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!emergencyContact._id) {
      this.hrService.addEmergencyContact(emergencyContact).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('Contact added successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    }

  }
  /**************************************************************************
   * @description Add/Update Evaluation
   *************************************************************************/
  addOrUpdateEvaluation(evaluationCheck: boolean, evaluation: any, applicationId: string, emailAddress: string , code: string) {
    evaluation.evaluation_code = code ? code : evaluation.HREvaluationKey.evaluation_code  ;
    evaluation.application_id = applicationId;
    evaluation.email_address = emailAddress ;

    if (evaluationCheck  && evaluation._id) {
      this.hrService.updateEvaluation(evaluation)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('Evaluation updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!evaluation._id) {
      this.hrService.addEvaluation(evaluation).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('Evaluation added successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    }

  }
  /**************************************************************************
   * @description Add/Update Goal
   *************************************************************************/
  addOrUpdateGoal(goalCheck: boolean , goal: any, applicationId: string, emailAdress: string, code: string) {
    goal.goal_code = code ? code : goal.HREvaluationGoalsKey.goal_code ;
    goal.application_id = applicationId;
    goal.email_address = emailAdress;
    if (goalCheck && goal._id) {
      this.hrService.updateEvaluationGoal(goal)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('Goal updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!goal._id) {

      this.hrService.addEvaluationGoal(goal).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('goal added successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        )
      ;
    }

  }
  /**************************************************************************
   * @description Add/Update Child
   *************************************************************************/
  addOrUpdateChild(childCheck: boolean, child: any, applicationId: string, emailAddress: string, code: string) {
    child.child_code = code ? code : child.HRChildKey.child_code;
    child.email_address = emailAddress;
    child.application_id = applicationId;
    if (childCheck && child._id) {
      this.hrService.updateChild(child)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('children updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!child._id) {
      this.hrService.addChild(child).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('children added successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    }

  }
  /**************************************************************************
   * @description Add/Update Identity Info
   *************************************************************************/
  addOrUpdateIdentifyDocument(identifyCheck: boolean, identityDocument: any, applicationId: string, emailAddress: string, code: string) {
    identityDocument.identity_document_code = code ? code : identityDocument.HRIdentityDocumentKey.identity_document_code;
    identityDocument.email_address = emailAddress;
    identityDocument.application_id = applicationId;
    console.log(identityDocument);
    if (identifyCheck && identityDocument._id) {

      this.hrService.updateIdentityDocument(identityDocument)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('Identity document updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!identityDocument._id) {
      this.hrService.addIdentityDocument(identityDocument).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('Identity document added successfuly', response);

          },
          (error) => {
            console.log('error', error);
          },
        );
    }
  }
  /**************************************************************************
   * @description Add/Update Extension Contract
   *************************************************************************/
  addOrUpdateExtensionContract(extensionCheck: boolean, extensionContract: any, applicationId: string, emailAddress: string, code: string) {
    extensionContract.extension_code = code ? code : extensionContract.HRContractExtensionKey.extension_code;
    extensionContract.email_address = emailAddress;
    extensionContract.application_id = applicationId;
    console.log(extensionContract);
    if (extensionCheck && extensionContract._id) {

      this.hrService.updateContractExtension(extensionContract)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('Contract Extension updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!extensionContract._id) {
      this.hrService.addContractExtension(extensionContract).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('Contract Extension added successfuly', response);

          },
          (error) => {
            console.log('error', error);
          },
        );
    }
  }
  /**************************************************************************
   * @description Add/Update Previous Contract
   *************************************************************************/
  // tslint:disable-next-line:max-line-length
  addOrUpdatePreviousContract(previousCheck: boolean, previousContract: any, collaborator_email: string , applicationId: string, emailAddress: string, code: string) {
    previousContract.contract_code = code ? code : previousContract.HRContractPreviousKey.contract_code;
    previousContract.email_address = emailAddress;
    previousContract.application_id = applicationId;
    previousContract.collaborator_email = collaborator_email;
    console.log('my object want to added ', previousContract);
    if (previousCheck && previousContract._id) {

      this.hrService.updatePreviousContract(previousContract)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (response) => {
            console.log('Previous Contract updated successfuly', response);
          },
          (error) => {
            console.log('error', error);
          },
        );
    } else if (!previousContract._id) {
      this.hrService.addPreviousContract(previousContract).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe(
          (response) => {
            console.log('Previous Contract  added successfuly', response);

          },
          (error) => {
            console.log('error', error);
          },
        );
    }
  }
  /**************************************************************************
   * @description delete Equipment
   *************************************************************************/
  deleteEquipment(id: string, email: string) {

    this.hrService.deleteEquipment(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res1) => {
          this.hrService.getEquipment(
            `?email_address=${email}`
          );
          this.utilsService.openSnackBar('Equipment deleted successfully', 'close');

        }
      );

  }
  /**************************************************************************
   * @description delete Evaluation Goal
   *************************************************************************/
  deleteEvaluationGoal(id: string, email: string) {

    this.hrService.deleteEvaluationGoal(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res1) => {
          this.hrService.getEvaluationGoals(
            `?email_address=${email}`
          );
          this.utilsService.openSnackBar('Evaluation Goal deleted successfully', 'close');

        }
      );

  }
  /**************************************************************************
   * @description delete Evaluation
   *************************************************************************/
  deleteEvaluation(id: string, email: string) {

    this.hrService.deleteEvaluation(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res1) => {
          this.hrService.getEvaluations(
            `?email_address=${email}`
          );
          this.utilsService.openSnackBar('Evaluation deleted successfully', 'close');

        }
      );

  }
  /**************************************************************************
   * @description Identity Document
   *************************************************************************/
  deleteIdentityDocument(id: string, email: string) {

    this.hrService.deleteIdentityDocument(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res1) => {
          this.hrService.getIdentityDocument(
            `?email_address=${email}`
          );
          this.utilsService.openSnackBar('Identity Document deleted successfully', 'close');
        }
      );

  }
  /**************************************************************************
   * @description delete Child
   *************************************************************************/
  deleteCHild(id: string, email: string) {

    this.hrService.deleteChild(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res1) => {
          this.hrService.getChildren(
            `?email_address=${email}`
          );
          this.utilsService.openSnackBar('Child deleted successfully', 'close');
        }
      );

  }
  /**************************************************************************
   * @description delete emergency Contact
   *************************************************************************/
  deleteEmergencyContact(id: string, email: string) {

    this.hrService.deleteEmergencyContact(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res1) => {
          this.hrService.getEmergencyContact(
            `?email_address=${email}`
          );
          this.utilsService.openSnackBar('Emergency Contact deleted successfully', 'close');
        }
      );

  }
  /**************************************************************************
   * @description delete Conttact Extension
   *************************************************************************/
  deleteContractExtension(id: string, email: string) {
    this.hrService.deleteContractExtension(id)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res1) => {
          this.hrService.getContractExtensions(
            `?email_address=${email}`
          );
          this.utilsService.openSnackBar('Contract extension deleted successfully', 'close');
        }
      );
  }
  /**************************************************************************
   * @description delete row from datatable
   *************************************************************************/
  deleteRowFromDataTable(list: BehaviorSubject<any>, copyList: any, code: string) {
    const element = copyList.filter(x => x.equipment_code === code)[0];
    console.log(element);
    const index = copyList.indexOf(element);
    console.log(index);
    copyList.splice(index, 1);
    list.next(copyList.slice());
  }
  /**************************************************************************
   * @description update row from datatable
   *************************************************************************/
  updateForm(update: BehaviorSubject<boolean>, add: BehaviorSubject<boolean>) {
    add.next(false);
    update.next(true);
  }
  /**************************************************************************
   * @description add row to datatable
   *************************************************************************/
  addForm(update: BehaviorSubject<boolean>, add: BehaviorSubject<boolean>) {
    update.next(false);
    add.next(true);
  }
  /**************************************************************************
   * @description generate code
   *************************************************************************/
  generateCode(ref: string): string {
    return  `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-${ref}` ;
  }
  /**************************************************************************
   * @description check date contract Collaborator
   * @param date1: Contract start on
   * @param date2: Contract end date
   *************************************************************************/
  checkDate(date1: string, date2?: string | null): boolean {
    const first = new Date(date1);
    const last = date2 ? new Date(date2) : new Date();
    const months = (last.getFullYear() - first.getFullYear()) * 12 + last.getMonth() - first.getMonth();
    if (months > 3) {
      return true;
    }
    return false;
  }
  /**************************************************************************
   * @description check date birthday Collaborator
   * @param date1: Contract start on
   *************************************************************************/
  collaboratorValidateDate(date: string) {
    const checkBirthday = new Date(date);
    const currentDate = new Date();
    const year =  currentDate.getFullYear() - checkBirthday.getFullYear();
    if (year > 17) {
      return true;
    }
    return false;
  }

}
