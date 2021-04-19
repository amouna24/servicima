import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { RoleFeatureService } from '@core/services/role-feature/role-feature.service';
import { FeatureService } from '@core/services/feature/feature.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UserService } from '@core/services/user/user.service';

import { IViewParam } from '@shared/models/view.model';
import { ICompanyModel } from '@shared/models/company.model';

@Component({
  selector: 'wid-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit, OnDestroy {
  form: FormGroup;
  company: ICompanyModel;
  action: string;
  languages = [];
  listFeatureAdded: string[] = [];
  listRoleFeatures: any[] = [];
  listRemoveRole: string[] = [];
  featureList: IViewParam[] = [];
  arrayToAddRoleFeature: any[] = [];
  roleFeatureControl = new FormControl([]);
  public filteredRoleFeature = new ReplaySubject(1);
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<AddRoleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private appInitializerService: AppInitializerService,
              private userService: UserService,
              private roleFeatureService: RoleFeatureService,
              private featureService: FeatureService,
              private refdataService: RefdataService, ) {
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit() {
    this.getConnectedUser();
    this.initForm();
    this.getAllFeatures();
    this.getLanguages();
     if (this.data) {
       this.action = 'Update';
       this.getCompanyRoleFeatures();
     } else {
       this.action = 'Add';
     }
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      company: [{ value: this.company[0].company_name, disabled: true }],
      roleName: [this.data ? this.data.data.ref_data_desc : '', [Validators.required]],
      roleFeatureFilterCtrl: [''],
      input: this.formBuilder.array(this.data ? this.data.list.map(data => this.formBuilder.group({
        language: [data.RefDataKey.language_id],
        desc: [data.ref_data_desc]
      })) : []),
    });
  }

  /**
   * @description : get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$.subscribe(
      (userInfo) => {
        if (userInfo) {
          this.company = userInfo['company'];
        }
      });
  }

  /**
   * @description : get all features
   */
  getAllFeatures() {
    this.featureService.getAllFeatures(this.userService.language.langId).subscribe( (features) => {
      this.featureList =  features.map((feature) => {
        return { value: feature.FeatureKey.feature_code, viewValue: feature.feature_desc};
      });
      this.filteredRoleFeature.next(this.featureList.slice());
      this.utilsService.changeValueField(this.featureList, this.form.controls.roleFeatureFilterCtrl, this.filteredRoleFeature);
    });
  }

  /**
   * @description : get company role features
   */
  getCompanyRoleFeatures() {
    this.userService.getCompanyRoleFeatures(this.data.data.RefDataKey.ref_data_code, this.userService.emailAddress).subscribe((data) => {
      this.listRoleFeatures = data as any[];
      this.listRoleFeatures = this.listRoleFeatures.map((list) => {
        return { value: list.companyRoleFeaturesKey.feature_code};
      });
      const addListFeatureRole = this.listRoleFeatures.map((roleFeature) => {
        return roleFeature.value;
      });
      this.listFeatureAdded = this.listRoleFeatures.map((roleFeatures) => {
        return roleFeatures.value;
      });
      this.roleFeatureControl.setValue(addListFeatureRole);
    });
  }

  /**
   * @description : remove role features
   */
  onRoleFeatureRemoved(roleFeature: string) {
    const roleFeatures = this.roleFeatureControl.value as string[];
    this.utilsService.removeElement(roleFeatures, roleFeature);
    if (this.listRemoveRole.indexOf(roleFeature) === -1) {
      this.listRemoveRole.push(roleFeature);
    }
    this.roleFeatureControl.setValue(roleFeatures); // To trigger change detection
  }

  /**
   * @description : action
   * param res: boolean
   */
  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    } else {
      /* Update role and role feature */
     if (this.data) {
       this.update();
     } else {
       this.addRoleAndRoleFeatures();
      }
    }
  }

  /**
   * @description: get languages
   */
  getLanguages(): void {
    this.languages = [];
    this.languages = this.appInitializerService.languageList.map((lang) => {
      return ({ value: lang._id, viewValue: lang.language_desc, selected: false });
    });
    this.languages.find(el => el.value === this.userService.language.langId).selected = true;
  }

  /**
   * @description  get list array input
   */
  getListRole() {
    return this.form.get('input') as FormArray;
  }

  /**
   * @description  add role name with translate
   */
  onAddAnotherRoleName() {
    return this.getListRole().push(this.formBuilder.group({ language: '', desc: '' }));
  }

  getValue(value, rang) {
    // this.languages.find(el => el.value === value).selected = true;
  }

  /**
   * @description  get all role
   */
 async getAllRole() {
   const allList = await this.refdataService.
   getRefData( this.utilsService.getCompanyId(this.userService.emailAddress, this.userService.applicationId) , this.userService.applicationId,
     ['ROLE'], true);
   this.dialogRef.close(allList['ROLE']);
 }

  /**
   * @description: add role and role feature
   */
  addRoleAndRoleFeatures() {
  /* add role and role feature */
  const role = {
    application_id: this.userService.applicationId,
    company_id: this.company[0]._id,
    ref_type_id: this.utilsService.getRefTypeId('ROLE'),
    language_id: this.userService.language.langId,
    ref_data_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
    ref_data_desc: this.form.value.roleName
  };

  /* Add role with current language */
  this.subscriptions.push(this.refdataService.addrefdata(role).subscribe((data) => {
    if (data) {
      /* Add role features */
      this.roleFeatureControl.value.map((feature) => {
        const roleFeature = {
          companyRoleFeaturesKey: {
            application_id: this.userService.applicationId,
            role_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
            email_address: this.userService.emailAddress,
            feature_code: feature,
          },
          granted_by: this.userService.emailAddress,
          company_id: this.company[0]._id,
          ref_type_id: this.utilsService.getRefTypeId('ROLE'),
          language_id: this.userService.language.langId,
          ref_data_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
          ref_data_desc: this.form.value.roleName
        };
        this.arrayToAddRoleFeature.push(roleFeature);
      });
      this.subscriptions.push(this.roleFeatureService.addManyFeatureRole(this.arrayToAddRoleFeature).subscribe(async (featureRole) => {
      await this.getAllRole();
      }));
    }
  }));

  /* Add role with other language */
  this.form.value.input.map((element) => {
    const listRoleUpdated = {
      application_id: this.userService.applicationId,
      role_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
      company_id: this.company[0]._id,
      ref_type_id: this.utilsService.getRefTypeId('ROLE'),
      language_id: element.language,
      ref_data_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
      ref_data_desc: element.desc
    };
    this.subscriptions.push( this.refdataService.addrefdata(listRoleUpdated).subscribe((data) => {
      if (data) {
        console.log(data);
      }
    }));
  });
}

  /**
   * @description: update role feature
   */
  update() {
    if (this.data) {
      /* update role desc with default language */
      if (this.form.value.roleName !== this.data.data.ref_data_desc) {
        const roleUpdated = {
          application_id: this.data.data.RefDataKey.application_id,
          email_address: this.data.data.RefDataKey.email_address,
          company_id: this.data.data.RefDataKey.company_id,
          ref_type_id: this.data.data.RefDataKey.ref_type_id,
          language_id: this.data.data.RefDataKey.language_id,
          ref_data_code: this.data.data.RefDataKey.ref_data_code,
          ref_data_desc: this.form.value.roleName
        };
        this.subscriptions.push(this.refdataService.updaterefdata(roleUpdated).subscribe((data) => {
          if (data) {
            console.log(data);
          }
        }));
      }
      /* update role with other languages and add it if is not exist */
      let i = 0;
      this.form.value.input.map((element) => {
        const roleUpdated = {
          application_id: this.data.data.RefDataKey.application_id,
          email_address: this.data.data.RefDataKey.email_address,
          company_id: this.data.data.RefDataKey.company_id,
          ref_type_id: this.data.data.RefDataKey.ref_type_id,
          language_id: element.language,
          ref_data_code: this.data.data.RefDataKey.ref_data_code,
          ref_data_desc: element.desc
        };
        if (i < this.data.list.length ) {
          this.subscriptions.push( this.refdataService.updaterefdata(roleUpdated).subscribe((data) => {
            if (data) {
              i = i + 1;
            }
          }));
        } else {
          this.subscriptions.push(this.refdataService.addrefdata(roleUpdated).subscribe((data) => {
            if (data) {
            }
          }));
        }
      });
      // remove roles features
      const listToRemove = _.difference(
        this.listFeatureAdded, this.roleFeatureControl.value);
      listToRemove.map((feature) => {
        this.subscriptions.push( this.roleFeatureService
          .getRoleFeature(this.userService.applicationId, this.userService.emailAddress, this.data.data.RefDataKey.ref_data_code, feature)
          .subscribe((data) => {
            if (data) {
              this.subscriptions.push(this.roleFeatureService.deleteFeatureRole(data[0]['_id']).subscribe(() => {
              }));
            }
          }));
      });

      // add roles features
      const addRoleList = _.differenceWith(this.roleFeatureControl.value, this.listFeatureAdded, _.isEqual);
      addRoleList.map((feature) => {
        const roleFeature = {
          application_id: this.userService.applicationId,
          role_code: this.data.data.RefDataKey.ref_data_code,
          email_address: this.userService.emailAddress,
          granted_by: this.userService.emailAddress,
          feature_code: feature,
        };
        this.subscriptions.push( this.roleFeatureService.addFeatureRole(roleFeature).subscribe((featureRole) => {
          console.log(featureRole);
        }));
      });
      this.dialogRef.close(true);
    }
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
