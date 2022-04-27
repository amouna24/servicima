import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {

  type = 'CLIENT';
  title = 'clients.clientmanagement';

  constructor() { }

  ngOnInit(): void {
  }

}
