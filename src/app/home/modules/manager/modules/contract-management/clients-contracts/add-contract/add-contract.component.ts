import { Component, OnInit } from '@angular/core';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContractKey } from '@shared/models/contractKey.model';

@Component({
  selector: 'wid-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {

  /* Static Customers And Status Declaration */
  Status = [
    { value: 5, viewValue: 'Signed'},
    { value: 4, viewValue: 'Draft'},
    { value: 3, viewValue: 'Created'}
  ];
  Types = [
    { value: 'CDI', viewValue: 'CDI'},
    { value: 'CDD', viewValue: 'CDD'},
  ];
  SignerCompanies = [
    { value: 'Europcar', viewValue: 'Europcar'},
    { value: 'Renault', viewValue: 'Renault'},
  ];
  Currency = [
    { value: 'Euro', viewValue: 'EUR'},
    { value: 'Dollar', viewValue: 'USD'},
    { value: 'Dinar', viewValue: 'TND'},
  ];
  Rates = [
    { value: 3, viewValue: 'Senior'},
    { value: 2, viewValue: 'Middle'},
    { value: 1, viewValue: 'Junior'},
  ];
  Collaborators = [
    { email: 'amine.sboui@widigital.com', name: 'amine.sboui@widigital.com'},
    { email: 'lorem.ipsum@email.com', name: 'lorem.ipsum@email.com'}
  ];
  Contractors = [
    { email: 'amine.sboui@widigital.com', name: 'amine.sboui@widigital.com'},
    { email: 'lorem.ipsum@email.com', name: 'lorem.ipsum@email.com'}
  ];
  /*******************************************/

  /* Declaring Form Group */
  contractForm: FormGroup;
   /**/
  constructor(
    private contractsService: ContractsService,
    private formBuilder: FormBuilder,
  ) {
    this.contractForm = new FormGroup({
    });

  }

  ngOnInit(): void {
    this.initContractForm();
  }

  /* Init Contract Form*/
  initContractForm() {
    this.contractForm = this.formBuilder.group({
      contractor_code: ['', [Validators.required]],
      collaborator_email: ['', Validators.required],
      contract_type: ['', Validators.required],
      contract_start_date: [''],
      contract_end_date: [''],
      contract_date: ['', [Validators.required]],
      contract_status: [''],
      signer_company_email: [''],
      signer_contractor_email: [''],
      signature_company_date: [''],
      signature_contractor_date: [''],
      contract_rate: ['', Validators.required],
      currency_cd: [''],
    });
  }

  /**
   * @description Create New Contract
   */
  createNewContract() {
    const newContract = this.contractForm.value;
    newContract.application_id = `2232`;
    newContract.email_address  = 'amine@test.com';
    newContract.contract_code  = `${Math.random().toString(36).substring(7)}`;
    console.log(newContract);
    this.contractsService.addContact(newContract).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
