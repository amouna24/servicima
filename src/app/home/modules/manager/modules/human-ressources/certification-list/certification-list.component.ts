import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IWorkCertificate } from '@shared/models/workCertificate.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { TranslateService } from '@ngx-translate/core';
import { IViewParam } from '@shared/models/view.model';
@Component({
  selector: 'wid-certification-list',
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.scss']
})
export class CertificationListComponent  {

}
