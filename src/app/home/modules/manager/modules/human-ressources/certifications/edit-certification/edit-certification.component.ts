import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'wid-edit-certification',
  templateUrl: './edit-certification.component.html',
  styleUrls: ['./edit-certification.component.scss']
})
export class EditCertificationComponent implements OnInit {
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
