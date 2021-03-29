import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-add-supplier-contract',
  templateUrl: './add-supplier-contract.component.html',
  styleUrls: ['./add-supplier-contract.component.scss']
})
export class AddSupplierContractComponent implements OnInit {

  type = 'SUPPLIER';
  title = 'new.contract';

  constructor() { }

  ngOnInit(): void {
  }

}
