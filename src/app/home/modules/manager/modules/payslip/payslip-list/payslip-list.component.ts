import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { SheetService } from '@core/services/sheet/sheet.service';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UploadPayslipService } from '@core/services/upload-payslip/upload-payslip.service';
import { environment } from '@environment/environment';

import { PayslipImportComponent } from '../payslip-import/payslip-import.component';

@Component({
  selector: 'wid-payslip-list',
  templateUrl: './payslip-list.component.html',
  styleUrls: ['./payslip-list.component.scss']
})
export class PayslipListComponent implements OnInit, OnDestroy {
  public ELEMENT_DATA = new BehaviorSubject<any[]>([]);
  public isLoading = new BehaviorSubject<boolean>(true);
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private subscriptions: Subscription[] = [];
  private companyEmail: string;
  private env = `${environment.uploadFileApiUrl}/show/`;
  constructor(private sheetService: SheetService,
              private userService: UserService,
              private utilService: UtilsService,
              private uploadPayslipService: UploadPayslipService,
              private modalServices: ModalService) {
  }

  async ngOnInit(): Promise<void> {
    await this.getData('ACTIVE');
    this.sheetService.registerSheets([{ sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent}]);
    this.modalServices.registerModals({ modalName: 'importPayslip', modalComponent: PayslipImportComponent});
  }

  getCollaboratorName(email_address: string): Promise<string> {
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
  async fillDataTable(status: string): Promise<any[]> {
    if (!this.companyEmail) {
      await this.getUserInfo();
    }
    return new Promise(
      resolve => {
        this.uploadPayslipService.getAssociatedPayslip(
          `?company_address${this.companyEmail}&application_id=${this.userService.applicationId}&status=${status}`
        ).subscribe(
          (res) => {
            const result = [];
            res.map(data => {
              this.getCollaboratorName(data.payslipKey.email_address).then(
                (collaboratorName) => {
                  res['full_name'] = collaboratorName;
                  res['email_address'] = data.payslipKey.email_address;
                  result.push({
                    _id: data._id,
                    full_name: collaboratorName,
                    email_address: data.payslipKey.email_address,
                    file_name: data.file_name,
                    month: data.month,
                    year: data.year});
                });
              });
            resolve(result);
          });
      });

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

  displayImportModal(data: any[]): void {
    this.modalServices.displayModal(
      'importPayslip',
      {
        files: data,
        application_id: this.userService.applicationId,
        company_email: this.companyEmail,
      },
      '62vw',
      '80vh').subscribe(
      async (res) => {
        await this.getData('ACTIVE');
      }
    );
  }

  async uploadPayslip(): Promise<void> {
    this.openUploadSheet().then(
      (data) => {
        if (data.length > 0) {
          this.displayImportModal(data);
        }
      });
  }

  deletePayslip(data: any[]): void {
    this.isLoading.next(true);
    data.map((row) => {
      this.uploadPayslipService.disableAssociatedPayslip(row._id).toPromise().then(
        async res => {
          this.getData('ACTIVE').then( () => {
            this.isLoading.next(false);
          });
        });
    });
  }

  openFile(fileName: string): void {
    window.open(`${this.env}${fileName}`, '_blank');
  }

  downloadFile(data): void {
    data.map((row) => {
      const element = document.createElement('a');
      element.href = `${this.env}${row.file_name}`;
      element.download = row.file_name;
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }
  async switchAction(rowAction): Promise<void> {
    switch (rowAction.actionType) {
      case ('update'):
        this.openFile(rowAction.data.file_name);
        break;
      case ('Delete'):
        this.deletePayslip(rowAction.data);
        break;
      case ('Download'):
        this.downloadFile(rowAction.data);
        break;
      case ('Import'):
        await this.uploadPayslip();
        break;
    }
  }

  async getData(event) {
    this.isLoading.next(true);
    await   this.fillDataTable(event).then( (res) => {
      this.ELEMENT_DATA.next(res);
      this.isLoading.next(false);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}
