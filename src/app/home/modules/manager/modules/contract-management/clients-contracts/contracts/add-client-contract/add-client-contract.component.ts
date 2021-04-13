import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-add-client-contract',
  templateUrl: './add-client-contract.component.html',
  styles: []
})
export class AddClientContractComponent implements OnInit {

  type = 'CLIENT';
  title = 'new.contract';

  constructor() { }

  ngOnInit(): void {
  }

}
