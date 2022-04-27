import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  type = 'CLIENT';
  title = 'contracts.addclient.title';

  constructor() { }

  ngOnInit(): void {
  }

}
