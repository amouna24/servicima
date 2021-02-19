import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'wid-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {

  type = 'SUPPLIER';
  title = 'Suppliers list';

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

}
