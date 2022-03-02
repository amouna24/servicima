import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-complete-required-information',
  templateUrl: './complete-required-information.component.html',
  styleUrls: ['./complete-required-information.component.scss']
})
export class CompleteRequiredInformationComponent implements OnInit {
  companyInformation: boolean;
  companyBankingInformation: boolean;
  userInformation: boolean;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
               private router: Router) { }

  ngOnInit(): void {
   const { companyInformation, companyBankingInformation, userInformation} = this.data;
   this.companyInformation = companyInformation;
   this.companyBankingInformation = companyBankingInformation;
   this.userInformation = userInformation;

  }
  goToUserInfo() {
    this.router.navigate(['/manager/user/edit-profile']);
  }

  goToCompanyInformation() {
    this.router.navigate(['/manager/settings/home-company/edit-company']);
  }

  goToCompanyBankingInformation() {
    this.router.navigate(['/manager/settings/company-banking-info']);
  }

}
