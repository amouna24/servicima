import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { IUserModel } from '@shared/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'wid-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /************************************************
   * @description STEPPER CONFIGURATIONS
   * - stepperConfig.type [ single / multiple ]
   * - nextStep initialized by false and will be changed
   * - lastStep can be a Done or Submit Buttons
   *   to true if step actions succeed
   ***********************************************/
  stepperConfig = {
      isLinear: false,
      type: 'multiple',
      multiple: {
        nextStep: false,
        lastStep: 'done',
        redirectTo: '/manager/contract-management/suppliers-contracts/suppliers-list'
      },
      single: { },
      style: {
        'backgroundColor': '#ffffff',
}
  };
  @ViewChild('stepper') stepper: CdkStepper;
  /********************************************* */

  /* STEPPER TEST */
  frmDetails: FormGroup;
  frmAddress: FormGroup;
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
    /* STEPPER TEST */
    this.frmDetails = this._formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
    });

    this.frmAddress = this._formBuilder.group({
      addressOne: [null, Validators.compose([Validators.required])],
      addressTwo: [null], // optional
    });
    /* ************ */
  }

  /************************************************
   * @description
   * - you can change function name
   * - another desc
   * @param stepRes: Contain the selected Index and FormGroup from stepperComponent
   * @return status as nextStep
   * [ if formIsValid: pass to nextStep = true
   *   if formIsInvalid: nextStep = false ]
   ***********************************************/
  onNotify(stepRes): void {
    if (stepRes.selectedFormGroup.value !== { }) {
      this.stepper.next();
      console.log('from child', stepRes.selectedFormGroup.value, stepRes.selectedIndex);
    } else {
      console.log('Something wrong :( !');
    }
  }
}
