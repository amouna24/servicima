import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { SheetService } from '@core/services/sheet/sheet.service';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UploadPayslipService } from '@core/services/upload-payslip/upload-payslip.service';

import { PayslipImportComponent } from '../payslip-import/payslip-import.component';

@Component({
  selector: 'wid-payslip-list',
  templateUrl: './payslip-list.component.html',
  styleUrls: ['./payslip-list.component.scss']
})
export class PayslipListComponent implements OnInit, OnDestroy {
  ELEMENT_DATA = new BehaviorSubject<any[]>([]);
  isLoading = new BehaviorSubject<boolean>(true);
  destroy$: Subject<boolean> = new Subject<boolean>();
  subscriptions: Subscription[] = [];
  private companyEmail: string;

  constructor(private sheetService: SheetService,
              private userService: UserService,
              private utilService: UtilsService,
              private uploadPayslipService: UploadPayslipService,
              private modalServices: ModalService) {
  }

  ngOnInit(): void {
    this.fillDataTable().then( (res) => {
      this.ELEMENT_DATA.next(res);
      this.isLoading.next(false);
    });
    this.sheetService.registerSheets([{ sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent}]);
    this.modalServices.registerModals({ modalName: 'importPayslip', modalComponent: PayslipImportComponent});
  }

  getCollaboratorName(email_address): Promise<string> {
    return new Promise(
      resolve => {
        this.userService.getAllUsers(
          `?application_id=${this.userService.applicationId}&email_address=${email_address}&user_type=COLLABORATOR`
        ).subscribe(
          (res) => {
            resolve(`${res['results'][0]['first_name']} ${res['results'][0]['last_name']}`);
          }
        );
      }
    );
  }

  fillDataTable(): Promise<any[]> {
    if (!this.companyEmail) {
      this.getUserInfo();
    }
    return new Promise(
      resolve => {
        this.uploadPayslipService.getAssociatedPayslip('').toPromise().then(
          (res) => {
            const result = [];
            res.map(data => {
              this.getCollaboratorName(data.payslipKey.email_address).then(
                (collaboratorName) => {
                  result.push({
                    full_name: collaboratorName,
                    email_address: data.payslipKey.email_address,
                    month: data.month,
                    year: data.year
                  });
                });
              });
            resolve(result);
          });
      }
    );

  }

  openUploadSheet(): Promise<any[]> {
    return new Promise(
      (resolve, reject) => {
        this.sheetService.displaySheet('uploadSheetComponent', { multiple: true, acceptedFormat: '.pdf'})
          .pipe(takeUntil(this.destroy$)).toPromise()
          .then((res) => {
            !!res ? resolve(res) : reject('Error');
          });
      });
  }

  getUserInfo(): void {
    this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.companyEmail = data.user[0]['company_email'];
        }
      });
  }

  displayImportModal(data): void {
    this.modalServices.displayModal(
      'importPayslip',
      {
        files: data,
        application_id: this.userService.applicationId,
        company_email: this.companyEmail,
      },
      '62vw',
      '80vh').subscribe(
      (res) => {
      }
    );
  }

  async uploadPayslip() {
    this.openUploadSheet().then(
      (data) => {
        this.displayImportModal(data);
      });
  }

  async switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('update'):
        break;
      case ('Delete'):
        console.log('Delete');
        break;
      case ('Download'):
        console.log('Download');
        break;
      case ('Import'):
        await this.uploadPayslip();
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
