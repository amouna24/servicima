import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { slideInOut, slideView } from '@shared/animations/animations';

@Component({
  selector: 'wid-buy-licence',
  templateUrl: './buy-licence.component.html',
  styleUrls: ['./buy-licence.component.scss'],
  animations: [
    slideView,
    slideInOut,
  ]
  })
export class BuyLicenceComponent implements OnInit {
  isLinear = false;
  paymentForm: FormGroup;
  name: string;
  emailAddress: string;
  param = {
    'feature' :  'CANDIDATE_FILE_ACCESS',
    'license': 123456
   };
  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {
  }
  facturations: string[] = ['Facturation annuelle - 35% d"economies"', 'Facturation mensuelle'];

  /**
   * @description Loaded when component in init state
   */
  ngOnInit() {
    this.userService.connectedUser$.subscribe((userInfo) => {
      if (userInfo) {
        this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
        this.name = `${userInfo['user'][0]['first_name']}  ${userInfo['user'][0]['last_name']}`;
      }
      });
      this.initForm();
        }

  /**
   * @description : initialization of the form
   */
  initForm() {
    this.paymentForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      suiteAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      iban: ['', [Validators.required]],
      payment: ['', [Validators.required]],
    });
  }
}
