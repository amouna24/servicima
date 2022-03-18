import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wid-show-certification',
  templateUrl: './show-certification.component.html',
  styleUrls: ['./show-certification.component.scss']
})
export class ShowCertificationComponent implements OnInit {
  collaborator = false;
  idCertif = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
    constructor(
        private route: ActivatedRoute,
    ) { }

  async ngOnInit(): Promise<void> {
      await this.route.queryParams
          .pipe(takeUntil(this.destroy$))
          .subscribe(async (params) => {
              this.idCertif = atob(params.idCertif);
          });
  }

}
