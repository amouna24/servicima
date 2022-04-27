import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractsService } from '@core/services/contracts/contracts.service';

@Component({
  selector: 'wid-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {

  type = 'SUPPLIER';
  title = 'contracts.addsupplier.title';

  constructor() {

  }

  ngOnInit(): void {
  }

}
