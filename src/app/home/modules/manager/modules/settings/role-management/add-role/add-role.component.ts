import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '@core/services/modal/modal.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { IViewParam } from '@shared/models/view.model';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
@Component({
  selector: 'wid-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  form: FormGroup;
  company;
  applicationId: string;
  languages: IViewParam[] = [];
  emailAddress: string;
  listRoleFeatures = [];
  public filteredLanguage = new ReplaySubject(1);
  featureList = [];
  intersListSection = [];
  toppingsControl = new FormControl([]);
  public filteredLegalForm = new ReplaySubject(1);
  onToppingRemoved(topping: string) {
    const toppings = this.toppingsControl.value as string[];
    this.removeFirst(toppings, topping);
    this.toppingsControl.setValue(toppings); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  constructor(public dialogRef: MatDialogRef<AddRoleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private modalService: ModalService,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private appInitializerService: AppInitializerService,
              private userService: UserService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    const cred = this.localStorageService.getItem('userCredentials');
    const language = this.localStorageService.getItem('language').langId;
    this.applicationId = cred['application_id'];
    this.emailAddress = cred['email_address'];
    this.userService.connectedUser$.subscribe(
        (userInfo) => {
          if (userInfo) {
            this.company = userInfo['company'];
          }
        });
    this.initForm();

    this.utilsService.getAllFeatures(language).subscribe((features) => {
      this.featureList = features;
      this.featureList = this.featureList.map((feature) => {
        return { value: feature.FeatureKey.feature_code, viewValue: feature.feature_desc};
    });
      this.filteredLegalForm.next(this.featureList.slice());
      this.utilsService.changeValueField(this.featureList, this.form.controls.legalFormFilterCtrl, this.filteredLegalForm);
    this.getLanguages();
    this.filteredLanguage.next(this.languages.slice());
    this.utilsService.changeValueField(this.languages, this.form.controls.languageFilterCtrl, this.filteredLanguage);
    if (this.data) {
    this.userService.getCompanyRoleFeatures(this.data.RefDataKey.ref_data_code, this.emailAddress).subscribe((data) => {
      this.listRoleFeatures = data as any[];
      this.listRoleFeatures =  this.listRoleFeatures.map((list) => {
        return { value: list.companyRoleFeaturesKey.feature_code  };
      });
    this.intersListSection =  this.listRoleFeatures.map((feature) => {
        return this.featureList.find(element => element.value  === feature.value);
      });
      this.toppingsControl.setValue(this.intersListSection);
    });

}
    });
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    console.log(this.data, 'data');

    this.form = this.formBuilder.group({
      company: [{ value: this.company[0].company_name, disabled: true }],
      language: ['', [Validators.required]],
      roleName: ['', [Validators.required]],
      roleDescription: ['', [Validators.required]],
      features: [''],
      featuresRoles: [''],
      legalFormCtrl: [ ],
      legalFormFilterCtrl: [],
      toppingsControl: [],
      languageCtrl: ['', [Validators.required]],
      languageFilterCtrl: [''],
    });
  }

  /**
   * @description : set the value of the form if it was an update user
   */
 /* setForm() {
    this.form.setValue({
      company: '',
      language: '',
      roleName: '',
      roleDescription: '',
      features: '',
      featuresRoles: '',
      legalFormCtrl: '',
      legalFormFilterCtrl: '',
      toppingsControl: '',
      languageCtrl: '',
      languageFilterCtrl: '',
    });
  }*/
  /**
   * @description : action
   * param res: boolean
   */
  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    } else {
      const role = {
        application_id: this.applicationId,
        role_code: this.form.value.roleName,
        company_id: this.company[0]._id,
        ref_type_id: this.utilsService.getRefTypeId('ROLE'),
        language_id: this.form.value.languageCtrl,
        ref_data_code: this.form.value.roleName,
        ref_data_desc: this.form.value.roleDescription
      };
      this.utilsService.addRole(role).subscribe((data) => {
        if (data) {
          this.toppingsControl.value.map((feature) => {
            const roleFeature = {
              application_id: this.applicationId,
              role_code: this.form.value.roleName,
              email_address: this.emailAddress,
              granted_by: this.emailAddress,
              feature_code: feature.value,
              company_id: this.company[0]._id,
              ref_type_id: this.utilsService.getRefTypeId('ROLE'),
              language_id: this.form.value.languageCtrl,
              ref_data_code: this.form.value.roleName,
              ref_data_desc: this.form.value.roleDescription
            };
            console.log(roleFeature, 'role feature');
           this.utilsService.addFeatureRole(roleFeature).subscribe((featureRole) => {
              console.log(featureRole, 'role feature company');
            });
          });
       }
      });
    }
  }
  /**
   * @description: get languages
   */
  getLanguages(): void {
    this.languages = [];
    this.languages = this.appInitializerService.languageList.map((language) => {
      return ({ value: language._id, viewValue: language.language_desc });
    });
  }

}
