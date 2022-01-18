import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-clients-contracts-list',
  templateUrl: './clients-contracts-list.component.html',
  styles: []
})
export class ClientsContractsListComponent implements OnInit {

  type = 'CLIENT';
  title = 'contracts_list';

  constructor() { }

  ngOnInit(): void {
  }

}
