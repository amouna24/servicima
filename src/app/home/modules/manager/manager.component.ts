import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { mainContentAnimation } from '@shared/animations/animations';
import { AlertRequiredDataComponent } from '@shared/components/alert-required-data/alert-required-data.component';
import { CompleteRequiredInformationComponent } from '@shared/components/complete-required-information/complete-required-information.component';
import { ModalService } from '@core/services/modal/modal.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyBankingInfoService } from '@core/services/company-banking-info/company-banking-info.service';

@Component({
  selector: 'wid-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class ManagerComponent implements OnInit, OnDestroy {
  completeRequiredInformation = {
    userInformation : false,
    companyInformation : false,
    companyBankingInformation : false
  };
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor( private userService: UserService,
               private modalService: ModalService,
               private companyBankingInfo: CompanyBankingInfoService,
  ) {
    this.userService.refresh = true;
    this.modalService.registerModals(
      { modalName: 'alert-required-data', modalComponent: AlertRequiredDataComponent });
    this.modalService.registerModals(
      { modalName: 'complete-required-information', modalComponent: CompleteRequiredInformationComponent });
  }

  /**
   * @description: Loaded when component in init state
   */
  ngOnInit() {
    this.userService.connectedUser$.pipe(takeUntil(this.destroyed$)).subscribe(data => {
      if (data) {
        this.companyBankingInfo.getCompanyBankingInfo(data['company'][0].companyKey.email_address).subscribe(
          (companyBankingInfo) => {
            this.completeRequiredInformation.companyBankingInformation = companyBankingInfo.length > 0;
            const requiredFieldUser = ['prof_phone', 'cellphone_nbr'];
            const requiredFieldCompany = ['registry_country', 'reg_nbr', 'legal_form', 'activity_code', 'activity_desc',
              'vat_nbr', 'phone_nbr1', 'phone_nbr2', 'fax_nbr', 'contact_email', 'currency_id', 'employee_nbr', 'capital'];
            this.completeRequiredInformation.userInformation = this.ValidateRequiredInformation(data['user'][0], requiredFieldUser);
            this.completeRequiredInformation.companyInformation = this.ValidateRequiredInformation(data['company'][0], requiredFieldCompany);
           // this.showPopRequiredInformation();
          }
        );
      }
    });
  }

  /**
   * @description: Validate required information
   * @param data: data
   * @param requiredFields: required fields
   * @return if is all required fields not null or no
   */
  ValidateRequiredInformation(data: object, requiredFields: string[]): boolean {
   return requiredFields.every((element) => {
      return !!(data[element] || data[element] === 0);
    });
  }

  /**
   * @description: show pop required information
   */
  showPopRequiredInformation() {
    if (!this.completeRequiredInformation.userInformation ||
      !this.completeRequiredInformation.companyBankingInformation ||
      !this.completeRequiredInformation.companyInformation) {
      setTimeout(() => {
        this.modalService.displayModal('alert-required-data', this.completeRequiredInformation,
          '500px', '145px',  ['animate__animated', 'animate__slideInUp'], { bottom: '20px', right: '20px'}
        ).pipe(takeUntil(this.destroyed$))
          .subscribe((() => {
            this.modalService.displayModal('complete-required-information', this.completeRequiredInformation,
              '500px', '330px',  ['animate__animated', 'animate__slideInUp'], { bottom: '20px', right: '20px'}).pipe(takeUntil(this.destroyed$));
          }));
      }, 1000);

    }
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
