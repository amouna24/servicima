import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { IUserModel } from '@shared/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'wid-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  /************************************************
   * @description STEPPER CONFIGURATIONS
   * - stepperConfig.type [ single / multiple ]
   * - stepperConfig.backgroundColor
   * - for multiple form Stepper, lastStep can be a Done or Submit Button
   * - stepperConfig.multiple.lastStep : 'done' // if lastStep does not contain a form
   * - stepperConfig.multiple.lastStep : 'submit' // if lastStep contain a form
   * - stepperConfig.multiple.redirectTo: 'url' // only for lastStep: done
   ***********************************************/
  stepperConfig = {
      type: 'multiple', // [multiple/single]
      multiple: {
        lastStep: 'done', // [submit/done]
        redirectTo: '/manager/contract-management/suppliers-contracts/suppliers-list'
      },
      style: {
        'backgroundColor': '#ffffff',
      }
  };
  @ViewChild('multiFormStepper') multiFormStepper: CdkStepper;
  @ViewChild('singleFormStepper') singleFormStepper: CdkStepper;
  /********************************************* */

  /* STEPPER TEST */
  frmDetails: FormGroup;
  frmAddress: FormGroup;

  frmStepper: FormGroup;
  frmValues: object = { };
  /* ************ */

  loaded: Promise<boolean>;
  ELEMENT_DATA: IUserModel[] = [];
  credentials: string;

  constructor(private userService: UserService,
              private profileService: ProfileService,
              private localStorageService: LocalStorageService,
              public dialog: MatDialog,
              /* STEPPER TEST */
              private _formBuilder: FormBuilder
              /* ************ */
              ) {
    this.credentials = this.localStorageService.getItem('userCredentials');

    this.profileService.getAllUser( this.credentials['email_address']).subscribe((data) => {
      this.ELEMENT_DATA = data;
    this.loaded = Promise.resolve(true);
    });
  }

  ngOnInit(): void {
    /* MULTI FORM STEPPER TEST */
    this.frmDetails = this._formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
    });

    this.frmAddress = this._formBuilder.group({
      addressOne: [null, Validators.compose([Validators.required])],
      addressTwo: [null], // optional
    });
    /********************************************* */

    /************************************************
     * @description in SingleForm we need to declare
     * our form like that
     * myForm = fb.group(
     *    {
     *      steps: fb.array(
     *            [
     *                fb.group({}), first Step
     *                fb.group({}), ..
     *                ..
     *                fb.group({}), last Step
     *            ])
     *    })
     /********************************************* */
    /* SINGLE FORM STEPPER TEST */
    this.frmStepper = this._formBuilder.group({
      steps: this._formBuilder.array([
                this._formBuilder.group({
                  firstName: ['First Name', Validators.compose([Validators.required])],
                  lastName: ['Last Name', Validators.compose([Validators.required])],
                  phone: [null], // optional
                  email: [
                    'johndoe@example.com',
                    Validators.compose([Validators.required, Validators.email]),
                  ],
                }),
                this._formBuilder.group({
                  addressOne: [null, Validators.compose([Validators.required])],
                  addressTwo: [null], // optional
                  city: [null, Validators.compose([Validators.required])],
                  county: [null, Validators.compose([Validators.required])],
                  country: [null, Validators.compose([Validators.required])],
                }),
                this._formBuilder.group({
                  creditCardNo: [
                    '4111 1111 1111 1111',
                    Validators.compose([Validators.required]),
                  ],
                  expiryDate: ['', Validators.compose([Validators.required])],
                  cvvCode: ['', Validators.compose([Validators.required])],
                }),
      ]),
    });
    /* ************ */
  }

  /************************************************
   * @description
   * - get results form Stepper
   * - for singleForm Stepper:
   *   - pass to nextStep if current Step is not the last one
   *   - if the current step is the last one, get the form value
   * @param stepRes: Contain the selected Index and the value of the the selected FormGroup from stepperComponent
   ***********************************************/
  onNotify(stepRes): void {
    if (this.stepperConfig.type === 'single') {
        if (stepRes.selectedIndex === this.frmStepper.value['steps'].length - 1 ) {
          this.frmValues = this.frmStepper.value;
          console.log(
            'allStepsValue', this.frmStepper.value
          );
        } else {
          this.singleFormStepper.next();
        }
    } else if (this.stepperConfig.type === 'multiple') {
      this.multiFormStepper.next();
      console.log(
        'stepValue', stepRes.selectedFormGroup.value,
        'stepIndex', stepRes.selectedIndex
      );
    } else {
      console.log('Something wrong :( !');
    }
  }

  /************************************************
   * @description FOR SINGLE FORM STEPPER
   * - @description ge Form Value
   * - @return value of steps Object
   ***********************************************/
  get formArray(): AbstractControl {
    return this.frmStepper.get('steps');
  }

}
