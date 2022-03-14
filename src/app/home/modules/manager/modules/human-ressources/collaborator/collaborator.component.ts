import { Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { HelperService } from '@core/services/helper/helper.service';
import { HelperHrService } from '@core/services/human-ressources/helper-hr.service';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { ModalService } from '@core/services/modal/modal.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { SheetService } from '@core/services/sheet/sheet.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UploadService } from '@core/services/upload/upload.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { IBanking } from '@shared/models/banking.model';
import { ICollaborator } from '@shared/models/collaborator.model';
import { FieldsAlignment, FieldsType, IDynamicForm, InputType } from '@shared/models/dynamic-component/form.model';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { IUserModel } from '@shared/models/user.model';
import { userType } from '@shared/models/userProfileType.model';
import { IViewParam } from '@shared/models/view.model';
import { BehaviorSubject, forkJoin, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'wid-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {
  /**************************************************************************
   * @description Form Group
   *************************************************************************/
  profileForm: FormGroup;

  /***********************************************<***************************
   * @description Collaborator
   *************************************************************************/
  collaboratorInfo: ICollaborator;
  emergencyContactTest = false;
  banking: IBanking;
  id: any;
  refData = { };

  /**************************************************************************
   * @description check if Collaborator have an account or no  true have false no
   *************************************************************************/
  bankingCheck = false;
  /**************************************************************************
   * @description check if Collaborator have an account or no  true have false no
   *************************************************************************/
  contractCheck = false;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions as
   * Subject
   * BehaviorSubject
   * Subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  private subscriptionModal: Subscription;
  private subscriptions: Subscription;

  /******************************************************************************************
   * @description IDENTITY & EVALUATION  & EVALUATION EXTENSION & CONTRACT & CONTRACT EXTENSION
   **************************************************************************************/
  selectedIdentityFile = [];
  selectedEvaluationFile = [];
  selectedExtensionContractFile = [];
  selectedContractFile = { file: FormData, name: ''};

  /**************************************************************************
   * @description related list
   *************************************************************************/
  countriesList: IViewParam[] = [];
  nationalitiesList: IViewParam[] = [];
  identityDocumentInfo = [];
  childInfo = [];
  equipmentInfo = [];
  evaluationInfo = [];
  emergencyContactInfo = [];
  contractExtensionInfo = [];
  contractPreviousInfo = [];
  goalInfo = [];
  bankingInfo: any = null;
  filteredCountries: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredCurrencies: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  contractTypeList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  filteredNationalities: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  filteredCurrency: ReplaySubject<IViewParam[]> = new ReplaySubject<IViewParam[]>(1);
  genderList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  titleList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  currencyList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  familySituationList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  identityDocumentList: BehaviorSubject<any> = new BehaviorSubject<any>(this.identityDocumentInfo);
  evaluationList: BehaviorSubject<any> = new BehaviorSubject<any>(this.evaluationInfo);
  goalList: BehaviorSubject<any> = new BehaviorSubject<any>(this.goalInfo);
  emergencyContactList: BehaviorSubject<any> = new BehaviorSubject<any>(this.emergencyContactInfo);
  documentTypeList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  jobTitleList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  childrenList: BehaviorSubject<any> = new BehaviorSubject<any>(this.childInfo);
  equipmentList: BehaviorSubject<any> = new BehaviorSubject<any>(this.equipmentInfo);
  canUpdateID: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddID: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateEv: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddEv: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateChild: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddChild: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateEquipment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddEquipment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateGoal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddGoal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateEmergencyContact: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddEmergencyContact: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdateExtension: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddExtension: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canUpdatePreviousContract: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canAddPreviousContract: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  contractExtensionList: BehaviorSubject<any> = new BehaviorSubject<any>(this.contractExtensionInfo);
  contractPreviousList: BehaviorSubject<any> = new BehaviorSubject<any>(this.contractPreviousInfo);
  contract: any = null;
  isLoadingImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**************************************************************************
   * @description collaborator Image
   *************************************************************************/
  avatar: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  haveImage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  photo: FormData;
  title = 'hr_folder_all';

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserModel = null;
  collaborator: ICollaborator = null;
  companyEmail: string;
  applicationId: string;
  emailAddress: string;
  selectedBloc: any;

  /**************************************************************************
   * @description Dynamic Component
   *************************************************************************/
  isLoading = new BehaviorSubject<boolean>(true);
  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  profileItems: IDynamicMenu[] = [
    {
      title: 'personal_data_all',
      titleKey: 'PERSONAL_DATA',
      child: []
    },
    {
      title: 'identity_doc_all',
      titleKey: 'IDENTITY_DOCUMENT',
      child: []
    },
    {
      title: 'contract_all',
      titleKey: 'CONTRACT',
      child: []
    },
    {
      title: 'previous_contract_all',
      titleKey: 'PREVIOUS_CONTRACT',
      child: []
    },
    {
      title: 'contract_ext_all',
      titleKey: 'CONTRACT_EXTENSION',
      child: []
    },
    {
      title: 'evaluation_all',
      titleKey: 'EVALUATION',
      child: []
    },
    {
      title: 'goal_all',
      titleKey: 'GOAL',
      child: []
    },
    {
      title: 'child_all',
      titleKey: 'CHILDREN',
      child: []
    },
    {
      title: 'emergency_contact_all',
      titleKey: 'EMERGENCY_CONTACT',
      child: []
    },
    {
      title: 'banking_info_all',
      titleKey: 'BANKING',
      child: []
    },
    {
      title: 'hr.collab.menu.eqp',
      titleKey: 'EQUIPMENT',
      child: []
    }
  ];
  dynamicForm: BehaviorSubject<IDynamicForm[]>;

  selectedFile = { file: FormData, name: ''};
  constructor(private appInitializerService: AppInitializerService,
              private route: ActivatedRoute,
              private utilsService: UtilsService,
              private formBuilder: FormBuilder,
              private uploadService: UploadService,
              private sheetService: SheetService,
              private refDataService: RefdataService,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private hrService: HumanRessourcesService,
              private modalServices: ModalService,
              private profileService: ProfileService,
              private router: Router,
              private helperService: HelperService,
              private hrHelper: HelperHrService,

  ) {
    this.initProfileForm();

    this.dynamicForm = new BehaviorSubject<IDynamicForm[]>([
      {
        'titleRef': 'PERSONAL_DATA',
        'fieldsLayout': FieldsAlignment.tow_items_with_image_at_right,
        'fields': [
          {
            label: 'first_name_all',
            placeholder: 'first_name_all',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'first_name',
            required: true

          },
          {
            label: 'last_name_all',
            placeholder: 'last_name_all',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'last_name',
            required: true
          },
          {
            type: FieldsType.IMAGE,
            imageInputs: {
              avatar: this.avatar,
              haveImage:  this.haveImage,
              modelObject:  this.userInfo,
              singleUpload: true,
              userType: userType.UT_USER,
              imageLoading: this.isLoadingImage
            }
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'email_all',
            placeholder: 'exp@email.com',
            type: FieldsType.INPUT,
            inputType: InputType.EMAIL,
            formControlName: 'email_address',
            required: true
          },
          {
            label: 'phone_all',
            placeholder: '+216 123 456 78',
            type: FieldsType.INPUT,
            inputType: InputType.NUMBER,
            formControlName: 'phone',
            required: true
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'birth_date_all',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'birth_date',
            required: true

          },
          {
            label: 'gender_all',
            placeholder: 'Gender',
            type: FieldsType.SELECT,
            selectFieldList: this.genderList,
            formControlName: 'gender_id'
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'birth_country_all',
            placeholder: 'birth_country_all',
            type: FieldsType.SELECT_WITH_SEARCH,
            filteredList: this.filteredCountries,
            formControlName: 'birth_country_id',
            searchControlName: 'countryBirthFilterCtrl',
            required: true

          },
          {
            label: 'birth_city_all',
            placeholder: 'birth_city_all',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'birth_city',
            required: true
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'address_label_all',
            placeholder: 'address_placeholder_all',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'adress',
            required: true
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'country_all',
            placeholder: 'country_all',
            type: FieldsType.SELECT_WITH_SEARCH,
            filteredList: this.filteredCountries,
            formControlName: 'country_id',
            searchControlName: 'countryFilterCtrl',
            required: true
          },
          {
            label: 'Zip',
            placeholder: 'zip_code',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'zip_code',
            required: true
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'family_sit_all',
            placeholder: 'family_sit_all',
            type: FieldsType.SELECT,
            selectFieldList: this.familySituationList,
            formControlName: 'family_situation_id',
            required: true,
          },
          {
            label: 'natio_all',
            placeholder: 'natio_all',
            type: FieldsType.SELECT_WITH_SEARCH,
            filteredList: this.filteredNationalities,
            searchControlName: 'nationalityFilterCtrl',
            formControlName: 'nationality_id',
            required: true
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'registre_nbr_all',
            placeholder: 'registre_nbr_all',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'registration_number',
            required: true
          },
          {
            label: 'social_sec_all',
            placeholder: 'social_sec_all',
            type: FieldsType.INPUT,
            inputType: InputType.NUMBER,
            formControlName: 'social_secu_nbr',
            required: true
          },
        ],
      },
      {
        titleRef: 'PERSONAL_DATA',
        fieldsLayout: FieldsAlignment.one_item_at_left,
        fields: [
          {
            label: 'medical_exam_date_all',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'medical_exam_date',
          },
        ],
      },
      {
        titleRef: 'IDENTITY_DOCUMENT',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: ['rowItem', 'type', 'validity_date', 'file', 'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Document type', prop: 'type', type: InputType.TEXT},
                { name: 'validity date', prop: 'validity_date', type: InputType.DATE},
                { name: 'Attachement', prop: 'file', type: InputType.TEXT},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.identityDocumentList,
            }
          },
        ],
      },
      {
        titleRef: 'IDENTITY_DOCUMENT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'doc_type_all',
            placeholder: 'doc_type_all',
            type: FieldsType.SELECT,
            selectFieldList: this.documentTypeList,
            formControlName: 'type',
            required: true
          },
          {
            label: 'valid_date_all',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'validity_date',
            required: true
          },
        ],
      },
      {
        titleRef: 'IDENTITY_DOCUMENT',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'attachment_all',
            placeholder: 'attachment_all',
            type: FieldsType.UPLOAD_FILE,
            formControlName: 'file',
            inputType: InputType.TEXT,
            required: true
          },
        ],
      },
      {
        titleRef: 'IDENTITY_DOCUMENT',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdateID,
            canAdd: this.canAddID,
          },
        ],
      },
      {
        titleRef: 'CONTRACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'rate_all',
            placeholder: '0.00',
            type: FieldsType.INPUT,
            inputType: InputType.NUMBER,
            formControlName: 'contract_rate',
            required: true
          },
          {
            label: 'currency_all',
            placeholder: 'currency_all',
            type: FieldsType.SELECT_WITH_SEARCH,
            filteredList: this.filteredCurrencies,
            formControlName: 'currency_cd',
            searchControlName: 'currencyFilter',
            required: true
          },
        ],
      },
      {
        titleRef: 'CONTRACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.ctr.start_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'contract_start_date',
            required: true
          },
          {
            label: 'hr.collab.ctr.end_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'contract_end_date',
            required: true
          },
        ],
      },
      {
        titleRef: 'CONTRACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.ctr.assign_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'contract_date',
            required: true
          },
          {
            label: 'contract_type_all',
            placeholder: 'contract_type_all',
            type: FieldsType.SELECT,
            selectFieldList: this.contractTypeList,
            formControlName: 'contract_type',
            required: true
          },
        ],
      },
      {
        titleRef: 'CONTRACT',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'attachment_all',
            placeholder: 'attachment_all',
            type: FieldsType.UPLOAD_FILE,
            formControlName: 'attachments',
            inputType: InputType.TEXT,
            required: true
          },
        ],
      },
      {
        titleRef: 'PREVIOUS_CONTRACT',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: [
                'rowItem',
                'company_name', 'contract_type', 'contract_start_date', 'contract_end_date',
                'country_code',
                'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Company', prop: 'company_name', type: InputType.TEXT},
                { name: 'contract_type', prop: 'contract_type', type: InputType.TEXT},
                { name: 'Start date', prop: 'contract_start_date', type: InputType.DATE},
                { name: 'End date', prop: 'contract_end_date', type: InputType.DATE},
                { name: 'Country', prop: 'country_code', type: InputType.TEXT},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.contractPreviousList,
            }
          },
        ],
      },
      {
        titleRef: 'PREVIOUS_CONTRACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'company_name_all',
            placeholder: 'company_name_all',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'company_name',
            required: true
          },
          {
            label: 'hr.collab.prv.country;',
            placeholder: 'hr.collab.prv.country;',
            type: FieldsType.SELECT_WITH_SEARCH,
            filteredList: this.filteredCountries,
            searchControlName: 'countryFilterCtrl',
            formControlName: 'country_code',
            required: true
          },
        ],
      },
      {
        titleRef: 'PREVIOUS_CONTRACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.prv.start_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'contract_start_date',
            required: true
          },
          {
            label: 'hr.collab.prv.end_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'contract_end_date',
            required: true
          },
        ],
      },
      {
        titleRef: 'PREVIOUS_CONTRACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.prv.rate',
            placeholder: '0.00',
            type: FieldsType.INPUT,
            inputType: InputType.NUMBER,
            min: 0,
            formControlName: 'contract_rate',
            required: true
          },
          {
            label: 'hr.collab.prv.currency',
            placeholder: 'hr.collab.prv.currency',
            type: FieldsType.SELECT_WITH_SEARCH,
            filteredList: this.filteredCurrencies,
            formControlName: 'currency_cd',
            searchControlName: 'currencyFilter',
            required: true
          },
        ],
      },
      {
        titleRef: 'PREVIOUS_CONTRACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.prv.ctrtype',
            placeholder: 'hr.collab.prv.ctrtype',
            type: FieldsType.SELECT,
            selectFieldList: this.contractTypeList,
            formControlName: 'contract_type',
            required: true
          },
          {
            label: 'hr.collab.prv.jobtl',
            placeholder: 'hr.collab.prv.jobtl',
            type: FieldsType.SELECT,
            selectFieldList: this.jobTitleList,
            formControlName: 'title_cd',
            required: true
          },
        ],
      },
      {
        titleRef: 'PREVIOUS_CONTRACT',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdatePreviousContract,
            canAdd: this.canAddPreviousContract,
          },
        ],
      },
      {
        titleRef: 'CONTRACT_EXTENSION',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: [
                'rowItem',
                'extension_rate', 'title_cd', 'extension_start_date', 'extension_end_date',
                'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Rate', prop: 'extension_rate', type: InputType.TEXT},
                { name: 'Job title', prop: 'title_cd', type: InputType.TEXT},
                { name: 'Start date', prop: 'extension_start_date', type: InputType.DATE},
                { name: 'End date', prop: 'extension_end_date', type: InputType.DATE},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.contractExtensionList,
            }
          },
        ],
      },
      {
        titleRef: 'CONTRACT_EXTENSION',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.ext.start_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'extension_start_date',
            required: true
          },
          {
            label: 'hr.collab.ext.end_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'extension_end_date',
            required: true
          },
        ],
      },
      {
        titleRef: 'CONTRACT_EXTENSION',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.ext.rate',
            placeholder: '0.00',
            type: FieldsType.INPUT,
            inputType: InputType.NUMBER,
            formControlName: 'extension_rate',
            required: true
          },
          {
            label: 'hr.collab.ext.jbt',
            placeholder: 'hr.collab.ext.jbt',
            type: FieldsType.SELECT,
            selectFieldList: this.jobTitleList,
            formControlName: 'title_cd',
            required: true
          },
        ],
      },
      {
        titleRef: 'CONTRACT_EXTENSION',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.ext.currency',
            placeholder: 'hr.collab.ext.currency',
            type: FieldsType.SELECT_WITH_SEARCH,
            filteredList: this.filteredCurrencies,
            formControlName: 'extension_currency_cd',
            searchControlName: 'currencyFilter',
            required: true
          },
          {
            label: 'hr.collab.ext.file',
            placeholder: 'hr.collab.ext.file',
            type: FieldsType.UPLOAD_FILE,
            formControlName: 'attachments',
            inputType: InputType.TEXT,
            required: true
          },
        ],
      },
      {
        titleRef: 'CONTRACT_EXTENSION',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdateExtension,
            canAdd: this.canAddExtension,
          },
        ],
      },
      {
        titleRef: 'EVALUATION',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: [
                'rowItem',
                'main_mission', 'evaluation_start_date', 'evaluation_end_date', 'report',
                'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Main mission', prop: 'main_mission', type: InputType.TEXT},
                { name: 'Evaluation start date', prop: 'evaluation_start_date', type: InputType.DATE},
                { name: 'Evaluation end date', prop: 'evaluation_end_date', type: InputType.DATE},
                { name: 'Report', prop: 'report', type: InputType.TEXT},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.evaluationList
            }
          },
        ],
      },

      {
        titleRef: 'EVALUATION',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.eval.miss',
            placeholder: 'hr.collab.eval.miss',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'main_mission',
            required: true
          },
          {
            label: 'hr.collab.eval.report',
            placeholder: 'hr.collab.eval.report',
            type: FieldsType.INPUT,
            formControlName: 'report',
            required: true
          },
        ],
      },

      {
        titleRef: 'EVALUATION',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.eval.d_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'evaluation_start_date',
            required: true
          },
          {
            label: 'hr.collab.eval.e_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'evaluation_end_date',
            required: true
          },
        ],
      },

      {
        titleRef: 'EVALUATION',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'hr.collab.eval.file',
            placeholder: 'hr.collab.eval.file',
            type: FieldsType.UPLOAD_FILE,
            formControlName: 'evaluation_doc',
            inputType: InputType.TEXT,
            required: true
          },
        ],
      },
      {
        titleRef: 'EVALUATION',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdateEv,
            canAdd: this.canAddEv,
          },
        ],
      },
      {
        titleRef: 'GOAL',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: [
                'rowItem',
                'description', 'expected_result', 'deadline',
                'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Description', prop: 'description', type: InputType.TEXT},
                { name: 'Expected Result', prop: 'expected_result', type: InputType.TEXT},
                { name: 'Deadline', prop: 'deadline', type: InputType.DATE},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.goalList,
            }
          },
        ],
      },

      {
        titleRef: 'GOAL',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.goal.desc',
            placeholder: 'hr.collab.goal.desc',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'description',
            required: true
          },
          {
            label: 'expected_result_all',
            placeholder: 'expected_result_all',
            type: FieldsType.INPUT,
            formControlName: 'expected_result',
            required: true
          },
        ],
      },

      {
        titleRef: 'GOAL',
        fieldsLayout: FieldsAlignment.one_item_at_left,
        fields: [
          {
            label: 'deadline_all',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'deadline',
            required: true
          },
        ],
      },

      {
        titleRef: 'GOAL',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdateGoal,
            canAdd: this.canAddGoal,
          },
        ],
      },
      {
        titleRef: 'CHILDREN',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: ['rowItem', 'full_name', 'birth_date', 'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Full name', prop: 'full_name', type: InputType.TEXT},
                { name: 'Birth date', prop: 'birth_date', type: InputType.DATE},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.childrenList,
            }
          },
        ],
      },
      {
        titleRef: 'CHILDREN',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.child.name',
            placeholder: 'hr.collab.child.name',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'full_name',
            required: true
          },
          {
            label: 'hr.collab.child.b_date',
            placeholder: 'dd/mm/yyyy',
            type: FieldsType.DATE_PICKER,
            formControlName: 'birth_date',
            required: true
          },
        ],
      },
      {
        titleRef: 'CHILDREN',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdateChild,
            canAdd: this.canAddChild,
          },
        ],
      },
      {
        titleRef: 'EMERGENCY_CONTACT',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: ['rowItem', 'full_name', 'phone', 'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Full name', prop: 'full_name', type: InputType.TEXT},
                { name: 'Phone', prop: 'phone', type: InputType.TEXT},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.emergencyContactList,
            }
          },
        ],
      },
      {
        titleRef: 'EMERGENCY_CONTACT',
        fieldsLayout: FieldsAlignment.tow_items,
        fields: [
          {
            label: 'hr.collab.cnt.name',
            placeholder: 'hr.collab.cnt.name',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'full_name',
            required: true
          },
          {
            label: 'hr.collab.cnt.phone',
            placeholder: 'hr.collab.cnt.phone',
            type: FieldsType.INPUT,
            inputType: InputType.NUMBER,
            formControlName: 'phone',
            required: true
          },
        ],
      },
      {
        titleRef: 'EMERGENCY_CONTACT',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdateEmergencyContact,
            canAdd: this.canAddEmergencyContact,
          },
        ],
      },
      {
        titleRef: 'BANKING',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'hr.collab.bank.name',
            placeholder: 'hr.collab.bank.name',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'bank_name',
            required: true
          },
        ],
      },
      {
        titleRef: 'BANKING',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'IBAN',
            placeholder: 'IBAN',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'iban',
            required: true
          },
        ],
      },
      {
        titleRef: 'BANKING',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'RIB',
            placeholder: 'RIB',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'rib',
            required: true
          },
        ],
      },
      {
        titleRef: 'EQUIPMENT',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            type: FieldsType.DATA_TABLE,
            dataTable: {
              displayedColumns: ['rowItem', 'equipment_name', 'Actions'],
              columns: [
                { prop: 'rowItem',  name: '', type: InputType.ROW_ITEM},
                { name: 'Equipment name', prop: 'equipment_name', type: InputType.TEXT},
                { prop: 'Actions',  name: 'Actions', type: InputType.ACTIONS},
              ],
              dataSource: this.equipmentList,
            }
          },
        ],
      },
      {
        titleRef: 'EQUIPMENT',
        fieldsLayout: FieldsAlignment.one_item_stretch,
        fields: [
          {
            label: 'equipment_all',
            placeholder: 'equipment_all',
            type: FieldsType.INPUT,
            inputType: InputType.TEXT,
            formControlName: 'equipment_name',
            required: true
          },
        ],
      },
      {
        titleRef: 'EQUIPMENT',
        fieldsLayout: FieldsAlignment.one_item_at_right,
        fields: [
          {
            type: FieldsType.ADD_MORE_OR_UPDATE,
            canUpdate: this.canUpdateEquipment,
            canAdd: this.canAddEquipment,
          },
        ],
      },
    ]);

  }
  async getDataFromPreviousRoute() {
    await  this.utilsService.verifyCurrentRoute('/manager/human-ressources/collaborator-list').subscribe( (data) => {
      this.selectedBloc = data._id;
      this.id = data._id;
      this.profileService.getUserById(this.id).subscribe((collab) => {
        this.collaborator = collab['results'][0];
        this.userInfo = collab['results'][0];
        console.log('user info ', this.userInfo);
        this.hrService.getBanking(`?email_address=${this.userInfo.userKey.email_address}`).subscribe(async (banking) => {
          this.bankingInfo = banking[0];
        });
      });
      this.hrService.getContractById(data.idContract).subscribe((contrat) => {
        this.contract = contrat[0];
      });

    });
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    await this.getDataFromPreviousRoute();

   this.profileService
      .getUserById(this.id)
      .subscribe(async (user) => {
        console.log('get user connected ', user);
        this.userInfo = user['results'][0];
        this.haveImage.next(user['results'][0]['photo']);
        this.avatar.next(await this.uploadService.getImage(user['results'][0]['photo']));
        this.isLoadingImage.next(false);
      });
   this.subscriptions = this.userService.connectedUser$.subscribe(async (data) => {
     if (!!data) {
       this.initProfileForm();
       console.log('data ', data);
       await this.getRefData(data['user'][0]['company_email']);
       await this.getInitialData();
     }
   });

    this.sheetService.registerSheets(
      [
        { sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent},
      ]);
  }
  /**************************************************************************
   * @description Init form with initial data
   *************************************************************************/
  initProfileForm() {
    this.profileForm = this.formBuilder.group({
      PERSONAL_DATA: this.formBuilder.group({
        first_name: [this.userInfo === null ? '' : this.userInfo.first_name, Validators.required],
        last_name: [this.userInfo === null ? '' : this.userInfo.last_name, Validators.required],
        email_address: [this.collaborator === null ? '' : this.collaborator.collaboratorKey.email_address, Validators.required],
        phone: [this.userInfo === null ? '' : this.userInfo.cellphone_nbr, Validators.required],
        birth_date: [this.collaborator === null ? '' : this.collaborator.birth_date, Validators.required],
        gender_id: [this.userInfo === null ? '' : this.userInfo.gender_id, Validators.required],
        birth_country_id: [this.collaborator === null ? '' : this.collaborator.birth_country_id, Validators.required],
        birth_city: [this.collaborator === null ? '' : this.collaborator.birth_city, Validators.required],
        adress: [this.collaborator === null ? '' : this.collaborator.adress, Validators.required],
        country_id: [this.collaborator === null ? '' : this.collaborator.country_id, Validators.required],
        countryFilterCtrl: [''],
        countryBirthFilterCtrl: [''],
        zip_code: [this.collaborator === null ? '' : this.collaborator.zip_code, Validators.required],
        family_situation_id: [this.collaborator === null ? '' : this.collaborator.family_situation_id, Validators.required],
        nationality_id: [this.collaborator === null ? '' : this.collaborator.nationality_id, Validators.required],
        nationalityFilterCtrl: [''],
        registration_number: [this.collaborator === null ? '' : this.collaborator.registration_number, Validators.required],
        social_secu_nbr: [this.collaborator === null ? '' : this.collaborator.social_secu_nbr, Validators.required],
        medical_exam_date: [this.collaborator === null ? '' : this.collaborator.medical_exam_date, Validators.required],
      }),
      IDENTITY_DOCUMENT: this.formBuilder.group({
        identity_document_code: [''],
        type: [''],
        validity_date: [''],
        file: [''],
      }),
      CONTRACT: this.formBuilder.group({
        contract_rate: [this.contract !== null ? this.contract.contract_rate : '', Validators.min(0)],
        currency_cd: [this.contract !== null ? this.contract.currency_cd : null],
        currencyFilter: [''],
        contract_start_date:  [this.contract !== null ? this.contract.contract_start_date : ''],
        contract_end_date:   [this.contract !== null ? this.contract.contract_end_date : ''],
        contract_date: [this.contract !== null ? this.contract.contract_date : ''],
        attachments: [this.contract !== null ? this.contract.attachments : ''],
        contract_type: [this.contract !== null ? this.contract.HRContractKey.contract_type : ''],
      }),
      PREVIOUS_CONTRACT: this.formBuilder.group({
        contract_code: [''],
        company_name: [''],
        contract_start_date:  [''],
        contract_end_date:  [''],
        contract_type:  [''],
        contract_rate: ['', Validators.min(0)],
        currency_cd: [''],
        currencyFilter: [''],
        country_code: [''],
        title_cd: [''],
        countryFilterCtrl: ['']
      }),
      CONTRACT_EXTENSION: this.formBuilder.group({
        extension_code: [''],
        extension_start_date:  [''],
        extension_end_date:  [''],
        extension_rate:  ['', Validators.min(0)],
        title_cd: [''],
        extension_currency_cd: [''],
        attachments: [''],
        currencyFilter: ['']
      }),
      EVALUATION: this.formBuilder.group({
        evaluation_code: [''],
        main_mission: [''],
        evaluation_start_date: [''],
        evaluation_end_date: [''],
        report: [''],
        evaluation_doc: ['']
      }),
      GOAL: this.formBuilder.group({
        goal_code: [''],
        description: [''],
        expected_result: [''],
        deadline: [''],
      }),
      CHILDREN: this.formBuilder.group({
        child_code: [''],
        full_name: [''],
        birth_date: [''],
      }),
      EMERGENCY_CONTACT: this.formBuilder.group({
        contact_code: [''],
        full_name:  [''],
        phone:  [''],
      }),
      BANKING: this.formBuilder.group({
        bank_name: [this.bankingInfo === null ? '' : this.bankingInfo.bank_name],
        iban: [this.bankingInfo === null ? '' : this.bankingInfo.iban],
        rib: [this.bankingInfo === null ? '' : this.bankingInfo.rib],
      }),
      EQUIPMENT: this.formBuilder.group({
        equipment_code: [''],
        equipment_name: [''],
      }),
    });
  }
  /**************************************************************************
   * @description Get collaborator info and initialize form
   *************************************************************************/
  async getInitialData() {
    const cred = this.localStorageService.getItem('userCredentials');

    this.applicationId = cred['application_id'];
    this.emailAddress = this.userInfo.userKey.email_address;
    this.companyEmail = cred['email_address'];
    this.profileService
      .getUserById(this.id)
      .subscribe(async user => {
          await this.getDataFromPreviousRoute();
          await this.getDataByEmail(this.emailAddress);
          this.hrService.getCollaborators(`?email_address=${this.emailAddress}`)
            .subscribe(async collaborator => {
              this.collaboratorInfo = collaborator[0];
              this.collaboratorInfo['email_address'] = collaborator[0]['collaboratorKey']['email_address'];
              await this.getData();
              this.profileForm.controls.PERSONAL_DATA['controls'].first_name.disable();
              this.profileForm.controls.PERSONAL_DATA['controls'].last_name.disable();
              this.profileForm.controls.PERSONAL_DATA['controls'].email_address.disable();
              this.profileForm.controls.PERSONAL_DATA['controls'].phone.disable();
              this.profileForm.controls.PERSONAL_DATA['controls'].gender_id.disable();
              this.isLoading.next(false);
              this.bankingCheck = this.bankingInfo !== null ? true : false;
              this.contractCheck = this.contract !== null ? true : false;

            });
        },
        error => {
          console.log('error', error);
        }

      );

    this.isLoading.next(false);

  }
  async getRefData(companyEmail: string) {
    /********************************** REF DATA **********************************/
    this.refData = await this.refDataService.getRefData(
      this.utilsService.getCompanyId(
        companyEmail,
        this.localStorageService.getItem('userCredentials')['application_id']),
      this.localStorageService.getItem('userCredentials')['application_id'],
      [ 'GENDER', 'FAMILY_SITUATION', 'HR_CT_TYPE', 'IDENTITY_TYPE', 'PROF_TITLES'],
      false
    );
    this.appInitializerService.countriesList.forEach((country) => {
      this.countriesList.push({ value : country.COUNTRY_CODE, viewValue: country.COUNTRY_DESC});
    });
    /***************************** FILTERED COUNTRY *******************************/
    this.filteredCountries.next(this.countriesList.slice());
    this.utilsService.changeValueField(
      this.countriesList,
      this.profileForm.controls.PERSONAL_DATA['controls'].countryFilterCtrl,
      this.filteredCountries
    );
    this.utilsService.changeValueField(
      this.countriesList,
      this.profileForm.controls.PERSONAL_DATA['controls'].countryBirthFilterCtrl,
      this.filteredCountries
    );
    this.utilsService.changeValueField(
      this.countriesList,
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].countryFilterCtrl,
      this.filteredCountries
    );
    this.currencyList.next(this.appInitializerService.currenciesList.map((currency) => {
      return { value: currency.CURRENCY_CODE, viewValue: currency.CURRENCY_DESC};
    }));
    this.filteredCurrencies.next(this.currencyList.value);
    this.utilsService.changeValueField(
      this.currencyList.value,
      this.profileForm.controls.CONTRACT['controls'].currencyFilter,
      this.filteredCurrencies
    );
    this.utilsService.changeValueField(
      this.currencyList.value,
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].currencyFilter,
      this.filteredCurrencies
    );
    this.utilsService.changeValueField(
      this.currencyList.value,
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].currencyFilter,
      this.filteredCurrencies
    );

    this.contractTypeList.next(this.refData['HR_CT_TYPE']);
    this.genderList.next(this.refData['GENDER']);
    this.familySituationList.next(this.refData['FAMILY_SITUATION']);
    this.documentTypeList.next(this.refData['IDENTITY_TYPE']);
    this.jobTitleList.next(this.refData['PROF_TITLES']);

  }

  async getDataByEmail(email: string) {
    const url = `?email_address=${email}`;
    forkJoin([
      this.hrService.getChildren(url),
      this.hrService.getEquipment(url),
      this.hrService.getEvaluations(url),
      this.hrService.getEvaluationGoals(url),
      this.hrService.getEmergencyContact(url),
      this.hrService.getIdentityDocument(url),
      this.hrService.getContractExtensions(url),
      this.hrService.getPreviousContracts(`?collaborator_email=${email}&contract_status=ACTIVE`)
    ])
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res[0]['msg_code'] === '0004' ) {
            this.childInfo = [];
          } else {
            this.childInfo = res[0];
            this.childrenList.next(this.childInfo.slice());
          }
          if (res[1]['msg_code'] === '0004' ) {
            this.equipmentInfo = [];

          } else {
            this.equipmentInfo = res[1];
            this.equipmentList.next(this.equipmentInfo.slice());
          }
          if (res[2]['msg_code'] === '0004') {
            this.evaluationInfo = [];

          } else {
            this.evaluationInfo = res[2];
            this.evaluationList.next(this.evaluationInfo.slice());
          }
          if (res[3]['msg_code'] === '0004') {
            this.goalInfo = [];

          } else {
            this.goalInfo = res[3];
            this.goalList.next(this.goalInfo.slice());
          }
          if (res[4]['msg_code'] === '0004') {
            this.emergencyContactInfo = [];
          } else {
            this.emergencyContactInfo = res[4];
            this.emergencyContactList.next(this.emergencyContactInfo);
          }
          if (res[5]['msg_code'] === '0004') {
            this.identityDocumentInfo = [];

          } else {
            this.identityDocumentInfo = res[5];
            this.identityDocumentList.next(this.identityDocumentInfo);
          }
          if (res[6]['msg_code'] === '0004') {
            this.contractExtensionInfo = [];
          } else {
            this.contractExtensionInfo = res[6];
            this.contractExtensionList.next(this.contractExtensionInfo);
          }
          if (res[7]['msg_code'] === '0004') {
            this.contractPreviousInfo = [];
            console.log('no data found');
          } else {
           this.contractPreviousInfo = res[7]['results'];
           this.contractPreviousList.next(this.contractPreviousInfo);
          }
        }

      );
  }
  /**************************************************************************
   * @description Check if URL contains the ID og
   *************************************************************************/
  canUpdate(_id: any): boolean {
    return _id && _id !== '';
  }

  /**************************************************************************
   * @description Create/Update New/Old Collaborator Informations
   * @param result
   * result.action: ['update', addMore]
   *************************************************************************/
  addInfo(result) {
    if (result.formGroupName === 'IDENTITY_DOCUMENT') {
      const validatedField = ['validity_date', 'type', 'file'];
      switch (result.action) {
        case 'update': {
          this.identityDocumentInfo.forEach(
            (element, index) => {
              if (((element.HRIdentityDocumentKey ? element.HRIdentityDocumentKey.identity_document_code : element.identity_document_code) ===
                this.profileForm.controls.IDENTITY_DOCUMENT['controls'].identity_document_code.value)
                && (this.utilsService.checkFormGroup(this.profileForm.controls.IDENTITY_DOCUMENT, validatedField))) {
                this.identityDocumentInfo[index].type = this.profileForm.controls.IDENTITY_DOCUMENT['controls'].type.value;
                this.identityDocumentInfo[index].selectedIdentityFile = this.selectedIdentityFile.pop();
                this.identityDocumentInfo[index].file = this.profileForm.controls.IDENTITY_DOCUMENT['controls']
                  .file.value;
                this.identityDocumentInfo[index].validity_date = this.profileForm.controls.IDENTITY_DOCUMENT['controls']
                  .validity_date.value;
                this.identityDocumentInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.IDENTITY_DOCUMENT.reset();
          this.hrHelper.addForm(this.canUpdateID, this.canUpdateID);
        }
          break;
        case 'addMore': {
          if (
            !this.utilsService.checkFormGroup(this.profileForm.controls.IDENTITY_DOCUMENT, validatedField)
          ) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.identityDocumentInfo.push(
              {
                identity_document_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-ID`,
                type: this.profileForm.controls.IDENTITY_DOCUMENT['controls'].type.value,
                file: this.profileForm.controls.IDENTITY_DOCUMENT['controls'].file.value,
                selectedIdentityFile: this.selectedIdentityFile.pop(),
                validity_date: this.profileForm.controls.IDENTITY_DOCUMENT['controls'].validity_date.value,
              }
            );
            this.identityDocumentList.next(this.identityDocumentInfo.slice());
            this.profileForm.controls.IDENTITY_DOCUMENT.reset();
            this.utilsService.openSnackBarWithTranslate('general.identity.doc.add', 'close', 2000);
          }
        }
          break;
      }
    } else if (result.formGroupName === 'EVALUATION') {
      const validatedField = ['main_mission', 'evaluation_start_date', 'evaluation_end_date', 'report', 'evaluation_doc'];
      switch (result.action) {
        case 'update': {
          this.evaluationInfo.forEach(
            (element, index) => {
              if (((element.HREvaluationKey ? element.HREvaluationKey.evaluation_code : element.evaluation_code) ===
                this.profileForm.controls.EVALUATION['controls'].evaluation_code.value)
                && (this.utilsService.checkFormGroup(this.profileForm.controls.EVALUATION, validatedField))
              ) {
                this.evaluationInfo[index].main_mission = this.profileForm.controls.EVALUATION['controls'].main_mission.value;
                this.evaluationInfo[index].evaluation_start_date = this.profileForm.controls.EVALUATION['controls'].evaluation_start_date.value;
                this.evaluationInfo[index].evaluation_end_date = this.profileForm.controls.EVALUATION['controls'].evaluation_end_date.value;
                this.evaluationInfo[index].report = this.profileForm.controls.EVALUATION['controls'].report.value;
                this.evaluationInfo[index].evaluation_doc = this.profileForm.controls.EVALUATION['controls'].evaluation_doc.value;
                this.evaluationInfo[index].selectedEvaluationFile = this.selectedEvaluationFile.pop();
                this.evaluationInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.EVALUATION.reset();
          this.hrHelper.addForm(this.canUpdateEv, this.canAddEv);
        }
          break;
        case 'addMore': {
          if (
            !this.utilsService.checkFormGroup(this.profileForm.controls.EVALUATION, validatedField)
          ) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.evaluationInfo.push(
              {
                evaluation_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-EV`,
                main_mission: this.profileForm.controls.EVALUATION['controls'].main_mission.value,
                evaluation_start_date: this.profileForm.controls.EVALUATION['controls'].evaluation_start_date.value,
                evaluation_end_date: this.profileForm.controls.EVALUATION['controls'].evaluation_end_date.value,
                report: this.profileForm.controls.EVALUATION['controls'].report.value,
                evaluation_doc: this.profileForm.controls.EVALUATION['controls'].evaluation_doc.value,
                selectedEvaluationFile: this.selectedEvaluationFile.pop(),
              }
            );
            this.evaluationList.next(this.evaluationInfo.slice());
            this.profileForm.controls.EVALUATION.reset();
            this.utilsService.openSnackBarWithTranslate('general.eval.add', 'close', 2000);
          }
        }
          break;
      }
    } else if (result.formGroupName === 'GOAL') {
      const validatedField = ['description', 'expected_result', 'deadline'];
      switch (result.action) {
        case 'update': {
          this.evaluationInfo.forEach(
            (element, index) => {
              if (((element.HREvaluationGoalsKey ? element.HREvaluationGoalsKey.goal_code : element.goal_code) ===
                this.profileForm.controls.GOAL['controls'].goal_code.value)
                && (this.utilsService.checkFormGroup(this.profileForm.controls.GOAL, validatedField))
              ) {
                this.goalInfo[index].description = this.profileForm.controls.GOAL['controls'].description.value;
                this.goalInfo[index].expected_result = this.profileForm.controls.GOAL['controls'].expected_result.value;
                this.goalInfo[index].deadline = this.profileForm.controls.GOAL['controls'].deadline.value;
                this.goalInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.GOAL.reset();
          this.hrHelper.addForm(this.canUpdateGoal, this.canAddGoal);
        }
          break;
        case 'addMore': {
          if (
           !this.utilsService.checkFormGroup(this.profileForm.controls.GOAL, validatedField)
          ) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.profileForm.controls.GOAL['controls'].goal_code.setValue(`WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-GOAL`);
            this.goalInfo.push(
              {
                goal_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-GOAL`,
                description: this.profileForm.controls.GOAL['controls'].description.value,
                expected_result: this.profileForm.controls.GOAL['controls'].expected_result.value,
                deadline: this.profileForm.controls.GOAL['controls'].deadline.value,
              }
            );
            this.goalList.next(this.goalInfo.slice());
            this.profileForm.controls.GOAL.reset();
            this.utilsService.openSnackBarWithTranslate('general.goal.add', 'close', 2000);
          }
        }
          break;
      }
    } else if (result.formGroupName === 'EMERGENCY_CONTACT') {
      const validatedField = ['full_name', 'phone'];
      switch (result.action) {
        case 'update': {
          this.emergencyContactInfo.forEach(
            (element, index) => {
              if (((element.HREmergencyContactKey ? element.HREmergencyContactKey.contact_code : element.contact_code) ===
                this.profileForm.controls.EMERGENCY_CONTACT['controls'].contact_code.value)
                && this.utilsService.checkFormGroup(this.profileForm.controls.EMERGENCY_CONTACT, validatedField)
              ) {
                this.emergencyContactInfo[index].full_name = this.profileForm.controls.EMERGENCY_CONTACT['controls'].full_name.value;
                this.emergencyContactInfo[index].phone = this.profileForm.controls.EMERGENCY_CONTACT['controls'].phone.value;
                this.emergencyContactInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.EMERGENCY_CONTACT.reset();
          this.hrHelper.addForm(this.canUpdateEmergencyContact, this.canAddEmergencyContact);
        }
          break;
        case 'addMore': {
          if (!this.utilsService.checkFormGroup(this.profileForm.controls.EMERGENCY_CONTACT, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.emergencyContactInfo.push(
              {
                contact_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-CONTACT`,
                full_name: this.profileForm.controls.EMERGENCY_CONTACT['controls'].full_name.value,
                phone: this.profileForm.controls.EMERGENCY_CONTACT['controls'].phone.value,
              }
            );
            this.emergencyContactList.next(this.emergencyContactInfo.slice());
            this.profileForm.controls.EMERGENCY_CONTACT.reset();
            this.utilsService.openSnackBarWithTranslate('general.contract.add', 'close', 2000);
          }
        }
          break;
      }
    } else if (result.formGroupName === 'CHILDREN') {
      const validatedField = ['full_name', 'birth_date'];
      switch (result.action) {
        case 'update': {
          this.childInfo.forEach(
            (element, index) => {
              if (((element.HRChildKey ? element.HRChildKey.child_code : element.child_code) ===
                this.profileForm.controls.CHILDREN['controls'].child_code.value)
               && this.utilsService.checkFormGroup(this.profileForm.controls.CHILDREN, validatedField)
              ) {
                this.childInfo[index].full_name = this.profileForm.controls.CHILDREN['controls'].full_name.value;
                this.childInfo[index].birth_date = this.profileForm.controls.CHILDREN['controls'].birth_date.value;
                this.childInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.CHILDREN.reset();
          this.hrHelper.addForm(this.canUpdateChild, this.canAddChild);
        }
          break;
        case 'addMore': {
          if (
            !this.utilsService.checkFormGroup(this.profileForm.controls.CHILDREN, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.childrenList.next([]);
            this.profileForm.controls.CHILDREN['controls'].child_code.setValue(`WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-CHILD`);
            this.childInfo.push(
              {
                child_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-CHILD`,
                full_name: this.profileForm.controls.CHILDREN['controls'].full_name.value,
                birth_date: this.profileForm.controls.CHILDREN['controls'].birth_date.value,
              }
            );
            this.childrenList.next(this.childInfo.slice());
            this.profileForm.controls.CHILDREN.reset();
            this.utilsService.openSnackBarWithTranslate('general.child.add', 'close', 2000);
          }
        }
          break;
      }
    } else if (result.formGroupName === 'EQUIPMENT') {
      const validatedField = ['equipment_name'];
      switch (result.action) {
        case 'update': {
          this.equipmentInfo.forEach(
            (element, index) => {
              if (((element.HREquipmentKey ? element.HREquipmentKey.equipment_code : element.equipment_code) ===
                this.profileForm.controls.EQUIPMENT['controls'].equipment_code.value)
                && this.utilsService.checkFormGroup(this.profileForm.controls.EQUIPMENT, validatedField)
              ) {
                this.equipmentInfo[index].equipment_name = this.profileForm.controls.EQUIPMENT['controls'].equipment_name.value;
                this.equipmentInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.EQUIPMENT.reset();
          this.hrHelper.addForm(this.canUpdateEquipment, this.canAddEquipment);
        }
          break;
        case 'addMore': {
          if (
            !this.utilsService.checkFormGroup(this.profileForm.controls.EQUIPMENT, validatedField)) {
          this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.profileForm.controls.EQUIPMENT['controls'].equipment_code.setValue(this.hrHelper.generateCode('EQ'));
            this.equipmentInfo.push(this.profileForm.controls.EQUIPMENT.value);
            this.equipmentList.next(this.equipmentInfo.slice());
            this.profileForm.controls.EQUIPMENT.reset();
            this.utilsService.openSnackBarWithTranslate('general.eqp.add', 'close', 2000);
          }
        }
          break;
      }
    } else if (result.formGroupName === 'CONTRACT_EXTENSION') {
      const validatedField =
        ['extension_start_date', 'extension_end_date', 'extension_rate', 'title_cd', 'extension_currency_cd', 'selectedExtensionContractFile'];
      switch (result.action) {
        case 'update': {
          this.contractExtensionInfo.forEach(
            (element, index) => {
              if (((element.HRContractExtensionKey ? element.HRContractExtensionKey.extension_code : element.extension_code) ===
                this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_code.value)
                && this.utilsService.checkFormGroup(this.profileForm.controls.CONTRACT_EXTENSION, validatedField)
              ) {
                this.contractExtensionInfo[index].extension_start_date =
                  this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value;
                this.contractExtensionInfo[index].extension_end_date =
                  this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value;
                this.contractExtensionInfo[index].extension_rate = this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value;
                this.contractExtensionInfo[index].title_cd = this.profileForm.controls.CONTRACT_EXTENSION['controls'].title_cd.value;
                this.contractExtensionInfo[index].selectedExtensionContractFile = this.selectedExtensionContractFile.pop();
                this.contractExtensionInfo[index].extension_currency_cd =
                  this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.value;
                this.contractExtensionInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.CONTRACT_EXTENSION.reset();
          this.hrHelper.addForm(this.canUpdateExtension, this.canAddExtension);
        }
          break;
        case 'addMore': {
          if (
            !this.utilsService.checkFormGroup(this.profileForm.controls.CONTRACT_EXTENSION, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.contractExtensionList.next([]);
            const addExtentionContract =  {
              extension_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-EXTHR`,
              extension_start_date: this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.value,
              extension_end_date: this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.value,
              extension_rate: this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.value,
              title_cd: this.profileForm.controls.CONTRACT_EXTENSION['controls'].title_cd.value,
              extension_currency_cd: this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.value,
              selectedExtensionContractFile: this.selectedExtensionContractFile.pop()
            };
            this.contractExtensionInfo.push(
              addExtentionContract
            );
            this.contractExtensionList.next(this.contractExtensionInfo.slice());
            this.profileForm.controls.CONTRACT_EXTENSION.reset();
            this.utilsService.openSnackBarWithTranslate('general.ext.add', 'close', 2000);
          }
        }
          break;
      }
    } else if (result.formGroupName === 'PREVIOUS_CONTRACT') {
      const validatedField =
        ['contract_start_date', 'contract_end_date', 'contract_rate', 'company_name', 'country_code', 'contract_type', 'title_cd', 'currency_cd'];
      switch (result.action) {
        case 'update': {
          this.contractPreviousInfo.forEach(
            (element, index) => {
              if (((element.HRContractPreviousKey ? element.HRContractPreviousKey.contract_code : element.contract_code) ===
                this.profileForm.controls.PREVIOUS_CONTRACT['controls'].extension_code.value)
                && this.utilsService.checkFormGroup(this.profileForm.controls.PREVIOUS_CONTRACT, validatedField)
              ) {

                this.contractPreviousInfo[index].contract_start_date =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_start_date.value;
                this.contractPreviousInfo[index].contract_end_date =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_end_date.value;
                this.contractPreviousInfo[index].contract_rate =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_rate.value;
                this.contractPreviousInfo[index].company_name =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].company_name.value;
                this.contractPreviousInfo[index].country_code =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].country_code.value;
                this.contractPreviousInfo[index].contract_type =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_type.value;
                this.contractPreviousInfo[index].title_cd =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].title_cd.value;
                this.contractPreviousInfo[index].currency_cd =
                  this.profileForm.controls.PREVIOUS_CONTRACT['controls'].currency_cd.value;
                this.contractPreviousInfo[index].updated = true;
              }
            }
          );
          this.profileForm.controls.PREVIOUS_CONTRACT.reset();
          this.hrHelper.addForm(this.canUpdatePreviousContract, this.canAddPreviousContract);
        }
          break;
        case 'addMore': {
          if (
            !this.utilsService.checkFormGroup(this.profileForm.controls.PREVIOUS_CONTRACT, validatedField)) {
            this.utilsService.openSnackBarWithTranslate('general.missing.field', 'close', 2000);
          } else {
            this.contractExtensionList.next([]);
            const addPreviousContract =  {
              contract_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-PRV`,
              contract_start_date: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_start_date.value,
              contract_end_date: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_end_date.value,
              contract_rate: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_rate.value,
              title_cd: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].title_cd.value,
              currency_cd: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].currency_cd.value,
              country_code: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].country_code.value,
              contract_type: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_type.value,
              company_name: this.profileForm.controls.PREVIOUS_CONTRACT['controls'].company_name.value,
            };
            this.contractPreviousInfo.push(
              addPreviousContract
            );
            this.contractPreviousList.next(this.contractPreviousInfo.slice());
            this.profileForm.controls.PREVIOUS_CONTRACT.reset();
            this.utilsService.openSnackBarWithTranslate('general.prv.add', 'close', 2000);
          }
        }
          break;
      }
    }
  }
  /**************************************************************************
   * @description get selected Action From Dynamic Component
   * @param rowAction Object { data, rowAction }
   * data _id
   * rowAction [show, update, delete]
   *************************************************************************/
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'): // this.showContact(rowAction.data);
        break;
      case ('update'): this.setInfo(rowAction);
        break;
      case('delete'):  this.onStatusChange(rowAction);
    }
  }
  /**************************************************************************
   * @description get rowData
   * update form with row details
   *************************************************************************/
  setInfo(row) {
    if (row.formGroupName === 'IDENTITY_DOCUMENT') {
      this.hrHelper.updateForm(this.canUpdateID, this.canAddID);
      this.profileForm.controls.IDENTITY_DOCUMENT['controls'].identity_document_code.setValue(
        row.data.HRIdentityDocumentKey?.identity_document_code ?
          row.data.HRIdentityDocumentKey?.identity_document_code : row.data.identity_document_code);
      this.profileForm.controls.IDENTITY_DOCUMENT['controls'].type.setValue(row.data.type);
      this.profileForm.controls.IDENTITY_DOCUMENT['controls'].validity_date.setValue(new Date(row.data.validity_date));
      this.profileForm.controls.IDENTITY_DOCUMENT['controls'].file.setValue(row.data.file);
    } else if (row.formGroupName === 'EVALUATION') {
      this.hrHelper.updateForm(this.canUpdateEv, this.canAddEv);
      this.profileForm.controls.EVALUATION['controls'].evaluation_code.setValue(
        row.data.HREvaluationKey?.evaluation_code ?
          row.data.HREvaluationKey?.evaluation_code : row.data.evaluation_code);
      this.profileForm.controls.EVALUATION['controls'].main_mission.setValue(row.data.main_mission);
      this.profileForm.controls.EVALUATION['controls'].
      evaluation_start_date.setValue(new Date(row.data.evaluation_start_date));
      this.profileForm.controls.EVALUATION['controls'].
      evaluation_end_date.setValue(new Date(row.data.evaluation_end_date));
      this.profileForm.controls.EVALUATION['controls'].report.setValue(row.data.report);
      this.profileForm.controls.EVALUATION['controls'].evaluation_doc.setValue(row.data.evaluation_doc);
    } else if (row.formGroupName === 'GOAL') {
      this.hrHelper.updateForm(this.canUpdateGoal, this.canAddGoal);
      this.profileForm.controls.GOAL['controls'].goal_code.setValue(
        row.data.HREvaluationGoalsKey?.goal_code ?
          row.data.HREvaluationGoalsKey?.goal_code : row.data.goal_code);
      this.profileForm.controls.GOAL['controls'].description.setValue(row.data.description);
      this.profileForm.controls.GOAL['controls'].
      deadline.setValue(new Date(row.data.deadline));
      this.profileForm.controls.GOAL['controls'].expected_result.setValue(row.data.expected_result);
    } else if (row.formGroupName === 'CHILDREN') {
      this.hrHelper.updateForm(this.canUpdateChild, this.canAddChild);
      this.profileForm.controls.CHILDREN['controls'].child_code.setValue(
        row.data.HRChildKey?.child_code ?
          row.data.HRChildKey?.child_code : row.data.child_code);
      this.profileForm.controls.CHILDREN['controls'].full_name.setValue(row.data.full_name);
      this.profileForm.controls.CHILDREN['controls'].birth_date.setValue(new Date(row.data.birth_date));
    } else if (row.formGroupName === 'EQUIPMENT') {
      this.hrHelper.updateForm(this.canUpdateEquipment, this.canAddEquipment);
      this.profileForm.controls.EQUIPMENT['controls'].equipment_code.setValue(
        row.data.HREquipmentKey?.equipment_code ?
          row.data.HREquipmentKey?.equipment_code : row.data.equipment_code);
      this.profileForm.controls.EQUIPMENT['controls'].equipment_name.setValue(row.data.equipment_name);
    } else if (row.formGroupName === 'EMERGENCY_CONTACT') {
      this.hrHelper.updateForm(this.canUpdateEmergencyContact, this.canAddEmergencyContact);
      this.profileForm.controls.EMERGENCY_CONTACT['controls'].contact_code.setValue(
        row.data.HREmergencyContactKey ?
          row.data.HREmergencyContactKey.contact_code : row.data.contact_code);
      this.profileForm.controls.EMERGENCY_CONTACT['controls'].full_name.setValue(row.data.full_name);
      this.profileForm.controls.EMERGENCY_CONTACT['controls'].phone.setValue(row.data.phone);
    } else if (row.formGroupName === 'CONTRACT_EXTENSION') {
      this.hrHelper.updateForm(this.canUpdateExtension, this.canAddExtension);
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_code.setValue(
        row.data.HRContractExtensionKey?.extension_code ?
          row.data.HRContractExtensionKey?.extension_code : row.data.extension_code);
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_code.setValue(row.data.extension_code);
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_start_date.setValue(new Date(row.data.extension_start_date));
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_end_date.setValue(new Date(row.data.extension_end_date));
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_rate.setValue(new Date(row.data.extension_rate));
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].extension_currency_cd.setValue(row.data.extension_currency_cd);
      this.profileForm.controls.CONTRACT_EXTENSION['controls'].title_cd.setValue(row.data.title_cd);
    } else if (row.formGroupName === 'PREVIOUS_CONTRACT') {
      this.hrHelper.updateForm(this.canUpdatePreviousContract, this.canAddPreviousContract);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].extension_code.setValue(
        row.data.HRContractPreviousKey?.contract_code ?
          row.data.HRContractPreviousKey?.contract_code : row.data.contract_code);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_code.setValue(row.data.contract_code);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_start_date.setValue(new Date(row.data.contract_start_date));
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_end_date.setValue(new Date(row.data.contract_end_date));
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_rate.setValue(row.data.contract_rate);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].currency_cd.setValue(row.data.currency_cd);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].company_name.setValue(row.data.company_name);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].title_cd.setValue(row.data.title_cd);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].country_code.setValue(row.data.country_code);
      this.profileForm.controls.PREVIOUS_CONTRACT['controls'].contract_type.setValue(row.data.contract_type);
    }
  }

  /**************************************************************************
   * @description Upload Image to Server  with async to promise
   *************************************************************************/
  async uploadFile(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        takeUntil(this.destroy$),
        map(response => response.file.filename)
      )
      .toPromise();
  }

  /**************************************************************************
   * @description : detect change made by DF to files
   *************************************************************************/
  getFile(obj) {
    obj.forEach(
      (doc) => {
        if (doc.formGroupName === 'IDENTITY_DOCUMENT') {
          this.selectedIdentityFile.push({ file: doc.data, name: doc.name});
          this.profileForm.patchValue(
            {
              IDENTITY_DOCUMENT: {
                file: doc.name,
              },
            }
          );
        } else if (doc.formGroupName === 'EVALUATION') {
          this.selectedEvaluationFile.push({ file: doc.data, name: doc.name});
          this.profileForm.patchValue(
            {
              EVALUATION: {
                evaluation_doc: doc.name,
              },
            }
          );
        } else if (doc.formGroupName === 'CONTRACT_EXTENSION') {
          this.selectedExtensionContractFile.push(({ file: doc.data , name: doc.name}));
          this.profileForm.patchValue(
            {
              CONTRACT_EXTENSION: {
                attachments: doc.name
              }
            }
          );
        } else if (doc.formGroupName === 'CONTRACT') {
          this.selectedContractFile.file = doc.data;
          this.selectedContractFile.name = doc.name;
          this.profileForm.patchValue(
            {
              CONTRACT: {
                attachments: doc.name,
              },
            }
          );
        }
      }
    );
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

  }
  /**************************************************************************
   * @description delete and confirm function from datatable
   *************************************************************************/
  onStatusChange(row) {
    const confirmation = {
      code: 'delete',
      title: 'delete Info',
      description: `Are you sure you want to delete ?`,
    };

    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {
            if (row.formGroupName === 'CHILDREN') {
              const code = row.data.HRChildKey?.child_code ?
                row.data.HRChildKey.child_code : row.data.child_code;
              const element = this.childInfo
                .filter(x => x.HRChildKey?.child_code === code || x.child_code === code)[0];
              const index = this.childInfo.indexOf(element);
              this.childInfo.splice(index, 1);
              this.childrenList.next(this.childInfo.slice());
              row.data._id ? this.hrHelper.deleteCHild(row.data._id, this.emailAddress) :
                this.utilsService.openSnackBarWithTranslate('general.child.delete', 'close', 2000);
              this.subscriptionModal.unsubscribe();
            } else if (row.formGroupName === 'IDENTITY_DOCUMENT') {
              const code = row.data.HRIdentityDocumentKey?.identity_document_code ?
                row.data.HRIdentityDocumentKey.identity_document_code : row.data.identity_document_code;
              const element = this.identityDocumentInfo
                .filter(x => x.HRIdentityDocumentKey?.identity_document_code === code || x.identity_document_code === code)[0];
              const index = this.identityDocumentInfo.indexOf(element);
              if (index !== -1) {
                this.identityDocumentInfo.splice(index, 1);
                this.identityDocumentList.next(this.identityDocumentInfo.slice());
                row.data._id ? this.hrHelper.deleteIdentityDocument(row.data._id, this.emailAddress) :
                  this.utilsService.openSnackBarWithTranslate('general.doc.delete', 'close', 2000);
                this.subscriptionModal.unsubscribe();
              }

            } else if (row.formGroupName === 'EVALUATION') {
              const code = row.data.HREvaluationKey?.evaluation_code ? row.data.HREvaluationKey.evaluation_code : row.data.evaluation_code;
              const element = this.evaluationInfo.filter(x => x.HREvaluationKey?.evaluation_code === code || x.evaluation_code === code)[0];
              const index = this.evaluationInfo.indexOf(element);
              if (index !== -1) {
                this.evaluationInfo.splice(index, 1);
                this.evaluationList.next(this.evaluationInfo.slice());
                row.data._id ? this.hrHelper.deleteEvaluation(row.data._id, this.emailAddress) :
                  this.utilsService.openSnackBar('general.eval.delete', 'close', 2000);
                this.subscriptionModal.unsubscribe();
              }

            } else if (row.formGroupName === 'GOAL') {
              const code = row.data.HREvaluationGoalsKey?.goal_code ? row.data.HREvaluationGoalsKey.goal_code : row.data.goal_code;
              const element = this.goalInfo.filter(x => x.HREvaluationGoalsKey?.goal_code === code || x.goal_code === code)[0];
              const index = this.goalInfo.indexOf(element);
              if ( index !== -1) {
                this.goalInfo.splice(index, 1);
                this.goalList.next(this.goalInfo.slice());
                row.data._id ? this.hrHelper.deleteEvaluationGoal(row.data._id, this.emailAddress) :
                  this.utilsService.openSnackBar('general.goal.delete', 'close', 2000);
                this.subscriptionModal.unsubscribe();
              }

            } else if (row.formGroupName === 'EQUIPMENT') {
              const code = row.data.HREquipmentKey?.equipment_code ? row.data.HREquipmentKey.equipment_code : row.data.equipment_code;
              const element = this.equipmentInfo.filter(x => x.HREquipmentKey?.equipment_code === code || x.equipment_code === code)[0];
              const index = this.equipmentInfo.indexOf(element);
              if (index !== -1) {

                this.equipmentInfo.splice(index, 1);
                this.equipmentList.next(this.equipmentInfo.slice());
                row.data._id ? this.hrHelper.deleteEquipment(row.data._id, this.emailAddress) :
                  this.utilsService.openSnackBar('general.eqp.delete', 'close', 2000);
                this.subscriptionModal.unsubscribe();
              }
            } else if (row.formGroupName === 'EMERGENCY_CONTACT') {
              const code = row.data.HREmergencyContactKey?.contact_code ? row.data.HREmergencyContactKey.contact_code : row.data.contact_code;
              const element = this.emergencyContactInfo.filter(x => x.HREmergencyContactKey?.contact_code === code || x.contact_code === code)[0];
              const index = this.emergencyContactInfo.indexOf(element);
              if (index !== -1) {
                this.emergencyContactInfo.splice(index, 1);
                this.emergencyContactList.next(this.emergencyContactInfo.slice());
                row.data._id ? this.hrHelper.deleteEmergencyContact(row.data._id, this.emailAddress) :
                  this.utilsService.openSnackBar('general.contact.delete', 'close', 2000);
                this.subscriptionModal.unsubscribe();
              }

            } else if (row.formGroupName === 'CONTRACT_EXTENSION') {
              const code = row.data.HRContractExtensionKey?.extension_code ? row.data.HRContractExtensionKey.extension_code : row.data.extension_code;
              const element = this.contractExtensionInfo
                .filter(x => x.HRContractExtensionKey?.extension_code === code || x .extension_code === code )[0];
              const index = this.contractExtensionInfo.indexOf(element);
              if (index !== -1) {
                this.contractExtensionInfo.splice(index, 1);
                this.contractExtensionList.next(this.contractExtensionInfo.slice());
                row.data._id ? this.hrHelper.deleteContractExtension(row.data._id, this.emailAddress) :
                  this.utilsService.openSnackBarWithTranslate('general.ext.delete', 'close', 2000);
                this.subscriptionModal.unsubscribe();
              }

            } else if (row.formGroupName === 'PREVIOUS_CONTRACT') {
              const code = row.data.HRContractPreviousKey?.contract_code ?  row.data.HRContractPreviousKey?.contract_code : row.data.contract_code;
              const element = this.contractPreviousInfo.filter(x => x.HRContractPreviousKey?.contract_code === code || x .contract_code === code )[0];
              const index = this.contractPreviousInfo.indexOf(element);
              if (index !== -1) {
                this.contractPreviousInfo.splice(index, 1);
                this.contractPreviousList.next(this.contractPreviousInfo.slice());
                if (row.data._id) {
                  this.hrService.disablePreviousContracts(row.data._id).subscribe((res1) => {
                    this.utilsService.openSnackBar('general.ext.delete', 'close', 2000);

                  }, (err) => { this.utilsService.openSnackBar('something wrong', 'close', 2000); });

                } else {
                  this.utilsService.openSnackBar('general.ext.delete', 'close', 2000);

                }
              }
            }
          }}
      );
  }
  /*********************************************************************************************************************
   * @description Create/Update CollaboratorInfo, Banking, Evaluation , Evaluation Goal, Contract ,Contract Extension
   * Childs, Emergency Contact
   * @params FormGroup
   ********************************************************************************************************************/
  async newCollaboratorInfo(data: FormGroup) {
    const Contract = this.profileForm.controls.CONTRACT.value;
    if (Contract.contract_start_date !== '') {
      this.contractCheck = true;
    }
      const contract_type = this.profileForm.controls.CONTRACT['controls'].contract_type?.value;
      this.contract !== null ?
        Contract['contract_code'] = this.contract.HRContractKey.contract_code
        : Contract['contract_code'] = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-CONTRACT` ;
      Contract['email_address'] = this.userInfo.company_email;
      Contract['application_id'] = this.applicationId;
      Contract['collaborator_email'] = this.collaborator.collaboratorKey.email_address;
       Contract['_id'] =  this.contract ? this.contract._id : '';
    if (this.contract && Contract['contract_code']) {
        if (this.selectedContractFile.name !== '') {
          Contract.attachments = await this.uploadFile(this.selectedContractFile.file);
        } else {
          Contract.attachments = this.contract ? this.contract.attachments : '';
        }
        const collaboratorEmail = this.collaborator.collaboratorKey.email_address;

        this.hrHelper.addOrUpdateContract(this.contractCheck, Contract, this.applicationId, this.emailAddress, collaboratorEmail, contract_type);

      }
      this.collaboratorInfo = this.profileForm.controls.PERSONAL_DATA.value;
      this.collaboratorInfo['email_address'] = this.emailAddress;
      this.collaboratorInfo['application_id'] = this.applicationId;
      this.hrHelper.updateCollaboratorInfo(this.collaboratorInfo);
      const Banking = this.profileForm.controls.BANKING.value;
      this.hrHelper.addOrUpdateBanking(this.bankingCheck, Banking, this.applicationId, this.emailAddress);
      this.equipmentInfo.forEach(
        (equipment) => {
          this.hrHelper.addOrUpdateEquipement(equipment.updated, equipment, this.applicationId, this.emailAddress, equipment.equipment_code);
        });
      this.emergencyContactInfo.forEach(
        (contact) => {
          this.hrHelper.addOrUpdateEmergencyContact(contact.updated, contact, this.applicationId, this.emailAddress, contact.contact_code);
        });
      for (const evaluation of this.evaluationInfo) {
        if (evaluation.selectedEvaluationFile  && evaluation?.selectedEvaluationFile?.name !== '') {
          evaluation.evaluation_doc = await this.uploadFile(evaluation.selectedEvaluationFile.file);
        }
        this.hrHelper.addOrUpdateEvaluation(evaluation.updated, evaluation, this.applicationId, this.emailAddress, evaluation.evaluation_code);
      }
      this.goalInfo.forEach(
        (goal) => {
          this.hrHelper.addOrUpdateGoal(goal.updated, goal, this.applicationId, this.emailAddress, goal.goal_code);
        });
      this.childInfo.forEach(
        (child) => {
          this.hrHelper.addOrUpdateChild(child.updated, child, this.applicationId, this.emailAddress, child.child_code);
        });
      for (const identityDocument of this.identityDocumentInfo) {
        if (identityDocument.selectedIdentityFile && identityDocument?.selectedIdentityFile?.name !== '') {
          identityDocument.file = await this.uploadFile(identityDocument.selectedIdentityFile.file);
        }
        this.hrHelper
          .addOrUpdateIdentifyDocument
          (identityDocument.updated, identityDocument, this.applicationId, this.emailAddress, identityDocument.identity_document_code);

      }
    for (const previousContact of this.contractPreviousInfo) {
      this.hrHelper.addOrUpdatePreviousContract
      (previousContact.updated, previousContact, this.emailAddress, this.applicationId, this.companyEmail, previousContact.contract_code);
    }
      if (this.contract) {
        for (const extensionContact of this.contractExtensionInfo) {
          if (extensionContact.selectedExtensionContractFile && extensionContact?.selectedExtensionContractFile?.name !== '') {
            extensionContact.attachments = await this.uploadFile(extensionContact.selectedExtensionContractFile.file);
          }
          extensionContact['contract_code'] = this.contract.HRContractKey.contract_code;
          this.hrHelper.addOrUpdateExtensionContract
          (extensionContact.updated, extensionContact, this.applicationId, this.emailAddress, extensionContact.extension_code);
        }
      } else {
        this.utilsService.openSnackBarWithTranslate('general.contact.no.dispo', 'close', 2000);

      }
      this.router.navigate(
        ['/manager/human-ressources/collaborator-list'],
      );
      this.utilsService.openSnackBarWithTranslate('general.collab.update', 'close', 2000);

  }

  getData() {
    /******************** FILTERED NATIONALITY *******************************/
    this.hrHelper.getNationalities(
      this.nationalitiesList,
      this.userInfo.language_id,
      this.profileForm.controls.PERSONAL_DATA['controls'].nationalityFilterCtrl,
      this.filteredNationalities
    );

  }

}
