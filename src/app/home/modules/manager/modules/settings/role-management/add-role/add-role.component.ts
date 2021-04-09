import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '@core/services/modal/modal.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import * as _ from 'lodash';
import { RoleFeatureService } from '@core/services/role-feature/role-feature.service';
import { FeatureService } from '@core/services/feature/feature.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
@Component({
  selector: 'wid-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  form: FormGroup;
  company;
  applicationId: string;
  languages = [];
  emailAddress: string;
  listFeatureAdded = [];
  language: string;
  listRoleFeatures = [];
  listRemoveRole = [];
  featureList = [];
  arrayToAddRoleFeature = [];
  roleFeatureControl = new FormControl([]);
  public filteredRoleFeature = new ReplaySubject(1);
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  onRoleFeatureRemoved(roleFeature: string) {
    const roleFeatures = this.roleFeatureControl.value as string[];
    this.removeFirst(roleFeatures, roleFeature);
    if (this.listRemoveRole.indexOf(roleFeature) === -1) {
      this.listRemoveRole.push(roleFeature);
    }
    this.roleFeatureControl.setValue(roleFeatures); // To trigger change detection
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
              private localStorageService: LocalStorageService,
              private roleFeatureService: RoleFeatureService,
              private featureService: FeatureService,
              private refdataService: RefdataService, ) {
  }

  ngOnInit(): void {
    /* get language id, application id and email address from local storage */
    const cred = this.localStorageService.getItem('userCredentials');
    const language = this.localStorageService.getItem('language').langId;
    this.applicationId = cred['application_id'];
    this.emailAddress = cred['email_address'];
    /* get connected user */
    this.userService.connectedUser$.subscribe(
        (userInfo) => {
          if (userInfo) {
            this.company = userInfo['company'];
          }
        });
    /* init form */
    this.initForm();
    /* get all features */
    this.featureService.getAllFeatures(language).subscribe((features) => {
      this.featureList = features;
      this.featureList = this.featureList.map((feature) => {
        return { value: feature.FeatureKey.feature_code, viewValue: feature.feature_desc};
    });
      this.filteredRoleFeature.next(this.featureList.slice());
      this.utilsService.changeValueField(this.featureList, this.form.controls.roleFeatureFilterCtrl, this.filteredRoleFeature);
   /* get languages */
    this.getLanguages();
    /* open interface update role and feature role  */
   if (this.data) {
     this.userService.getCompanyRoleFeatures(this.data.data.RefDataKey.ref_data_code, this.emailAddress).subscribe((data) => {
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
    });

  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      company: [{ value: this.company[0].company_name, disabled: true }],
      roleName: [this.data ? this.data.data.ref_data_desc : '', [Validators.required]],
      features: [''],
      featuresRoles: [''],
      roleFeatureCtrl: [ ],
      roleFeatureFilterCtrl: [],
      input: this.formBuilder.array(this.data ? this.data.list.map(data => this.formBuilder.group({
        grade: [data.RefDataKey.language_id],
        value: [data.ref_data_desc]
      })) : []),
    });
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
            this.refdataService.updaterefdata(roleUpdated).subscribe((data) => {
              if (data) {
                console.log(data);
              }
            });
        }
        /* update role desc with other languages and add it if is not exist */
        let i = 0;
        this.form.value.input.map((desc) => {
          if (i < this.data.list.length ) {
            const roleUpdated = {
              application_id: this.data.data.RefDataKey.application_id,
              email_address: this.data.data.RefDataKey.email_address,
              company_id: this.data.data.RefDataKey.company_id,
              ref_type_id: this.data.data.RefDataKey.ref_type_id,
              language_id: desc.grade,
              ref_data_code: this.data.data.RefDataKey.ref_data_code,
              ref_data_desc: desc.value
            };
            this.refdataService.updaterefdata(roleUpdated).subscribe((data) => {
              if (data) {
                i = i + 1;
              }
            });
          } else {
            const listRoleUpdated = {
              application_id: this.data.data.RefDataKey.application_id,
              email_address: this.data.data.RefDataKey.email_address,
              company_id: this.data.data.RefDataKey.company_id,
              ref_type_id: this.data.data.RefDataKey.ref_type_id,
              language_id: desc.grade,
              ref_data_code: this.data.data.RefDataKey.ref_data_code,
              ref_data_desc: desc.value
            };
            this.refdataService.addrefdata(listRoleUpdated).subscribe((data) => {
              if (data) {
              }
            });
          }
        });

        // remove roles features
        this.listRemoveRole.map((feature) => {
          this.roleFeatureService.getRoleFeature(this.applicationId, this.emailAddress, this.data.data.RefDataKey.ref_data_code, feature)
            .subscribe((data) => {
            if (data) {
              this.roleFeatureService.deleteFeatureRole(data[0]['_id']).subscribe(() => {
              });
            }
          });
        });

        // add roles features
        const addRoleList = _.differenceWith(this.roleFeatureControl.value, this.listFeatureAdded, _.isEqual);
        addRoleList.map((feature) => {
          const roleFeature = {
            application_id: this.applicationId,
            role_code: this.data.data.RefDataKey.ref_data_code,
            email_address: this.emailAddress,
            granted_by: this.emailAddress,
            feature_code: feature,
          };
          this.roleFeatureService.addFeatureRole(roleFeature).subscribe((featureRole) => {
            console.log(featureRole);
          });
        });
        this.dialogRef.close();
      } else {
        /* add role and role feature */
        const role = {
          application_id: this.applicationId,
          role_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
          company_id: this.company[0]._id,
          ref_type_id: this.utilsService.getRefTypeId('ROLE'),
          language_id: this.language,
          ref_data_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
          ref_data_desc: this.form.value.roleName
        };
        this.refdataService.addrefdata(role).subscribe((data) => {
          if (data) {
            this.roleFeatureControl.value.map((feature) => {
              const roleFeature = {
                companyRoleFeaturesKey: {
                  application_id: this.applicationId,
                  role_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
                  email_address: this.emailAddress,
                  feature_code: feature,
                },
                granted_by: this.emailAddress,
                company_id: this.company[0]._id,
                ref_type_id: this.utilsService.getRefTypeId('ROLE'),
                language_id: this.language,
                ref_data_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
                ref_data_desc: this.form.value.roleName
              };
              this.arrayToAddRoleFeature.push(roleFeature);
          /*    this.roleFeatureService.addFeatureRole(roleFeature).subscribe((featureRole) => {
                console.log(featureRole, 'role feature company');
                this.dialogRef.close();
              }); */
            });
        this.roleFeatureService.addManyFeatureRole(this.arrayToAddRoleFeature).subscribe(async (featureRole) => {
          console.log(featureRole);
          const allList = await this.refdataService.
          getRefData( this.utilsService.getCompanyId(this.emailAddress, this.applicationId) , this.applicationId,
            ['ROLE'], true);
          this.dialogRef.close(allList['ROLE']);
        });
          }
        });
        this.form.value.input.map((desc) => {
          const listRoleUpdated = {
            application_id: this.applicationId,
            role_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
            company_id: this.company[0]._id,
            ref_type_id: this.utilsService.getRefTypeId('ROLE'),
            language_id: desc.grade,
            ref_data_code: this.form.value.roleName.split(' ').join('').toUpperCase(),
            ref_data_desc: desc.value
          };
          this.refdataService.addrefdata(listRoleUpdated).subscribe((data) => {
            if (data) {
              console.log(data);
            }
          });
        });
      }
    }
  }

  /**
   * @description: get languages
   */
  getLanguages(): void {
    this.language = this.localStorageService.getItem('language').langId;
    this.languages = [];
    this.languages = this.appInitializerService.languageList.map((lang) => {
      return ({ value: lang._id, viewValue: lang.language_desc, selected: false });
    });
    this.languages.find(el => el.value === this.language).selected = true;
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
    return this.getListRole().push(this.formBuilder.group({ grade: '', value: '' }));
  }
  getValue(value, rang) {
   // this.languages.find(el => el.value === value).selected = true;
  }
}
