import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wid-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {
  codeError: string;
  constructor(private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    await this.route.queryParams.subscribe(params => {
      this.codeError = params['codeError'] ? params['codeError'] : '404';
      console.log(this.codeError);
    });
  }

}
