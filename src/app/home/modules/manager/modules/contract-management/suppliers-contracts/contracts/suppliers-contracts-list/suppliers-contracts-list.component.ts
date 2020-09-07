import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-suppliers-contracts-list',
  templateUrl: './suppliers-contracts-list.component.html',
  styleUrls: ['./suppliers-contracts-list.component.scss']
})
export class SuppliersContractsListComponent implements OnInit {

  type = 'SUPPLIER';
  title = 'SUPPLIERS CONTRACTS MANAGEMENT';

  constructor() { }

  ngOnInit(): void {
  }

}
