import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UploadSheetComponent } from '@shared/components/upload-sheet/upload-sheet.component';
import { SheetService } from '@core/services/sheet/sheet.service';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';
import { UploadPayslipService } from '@core/services/upload-payslip/upload-payslip.service';
import { environment } from '@environment/environment';
import { UploadService } from '@core/services/upload/upload.service';

import { PayslipImportComponent } from '../payslip-import/payslip-import.component';

declare var require: any;
// tslint:disable-next-line:no-var-requires
const FileSaver = require('file-saver');
@Component({
  selector: 'wid-payslip-list',
  templateUrl: './payslip-list.component.html',
  styleUrls: ['./payslip-list.component.scss']
})
export class PayslipListComponent implements OnInit {
  public ELEMENT_DATA = new BehaviorSubject<any[]>([]);
  private payslipList: any[];
  public isLoading = new BehaviorSubject<boolean>(true);
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private companyEmail: string;
  private env = `${environment.uploadFileApiUrl}/show/`;
  constructor(private sheetService: SheetService,
              private userService: UserService,
              private utilService: UtilsService,
              private uploadPayslipService: UploadPayslipService,
              private uploadService: UploadService,
              private modalServices: ModalService) {
  }

  ngOnInit() {
    this.getData('ACTIVE').then(
      () => {
        this.sheetService.registerSheets([{ sheetName: 'uploadSheetComponent', sheetComponent: UploadSheetComponent}]);
        this.modalServices.registerModals({ modalName: 'importPayslip', modalComponent: PayslipImportComponent});
      });

  }

  checkLoad() {
    this.isLoading.next(this.ELEMENT_DATA.value.length !== this.payslipList.length);
    return this.isLoading;
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
      async resolve => {
        this.uploadPayslipService.getAssociatedPayslip(
          `?company_address=${this.companyEmail}&application_id=${this.userService.applicationId}&status=${status}`
        ).toPromise().then(
          async (res) => {
            if (!!res) {
              this.payslipList = res;
              await this.loadDataTable(res).then(
                (resp) => {
                  this.ELEMENT_DATA.next(resp);
                  resolve(resp);
                });
            }
          });
      });

  }

  loadDataTable(file): Promise<any[]> {
    return new Promise(
      resolve => {
        // tslint:disable-next-line:no-shadowed-variable
        const result = [];
        file.map(data => {
          this.getCollaboratorName(data.payslipKey.email_address).then(
            (collaboratorName) => {
              const monthName = new Date(0, Number(data.month)).toLocaleString('default', { month: 'long' });
              result.push({
                _id: data._id,
                full_name: collaboratorName,
                email_address: data.payslipKey.email_address,
                file_name: data.file_name,
                month: monthName,
                year: data.year});
            });
        });
        resolve (result);
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

  async displayImportModal(data: any[]): Promise<void> {
    this.modalServices.displayModal(
      'importPayslip',
      {
        files: data,
        application_id: this.userService.applicationId,
        company_email: this.companyEmail,
      },
      '62vw',
      '80vh').subscribe(
      async () => {
        await this.getData('ACTIVE');
      }
    );
  }

  async importPayslip(): Promise<void> {
    this.openUploadSheet().then(
      async (data) => {
        if (data.length > 0) {
          await this.displayImportModal(data);
        }
      });
  }

  deletePayslip(data: any[]): void {
    data.map((row) => {
      this.uploadPayslipService.disableAssociatedPayslip(row._id).toPromise().then(
        async () => {
          await this.getData('ACTIVE');
        });
    });
  }

  openFile(fileName: string): void {
    window.open(`${this.env}${fileName}`, '_blank');
  }

  downloadFile(data): void {
    data.map((row) => {
      const fileURL = `${this.env}${row.file_name}`;
      const fileName = `Payslip-${row.full_name}-${row.month}-${row.year}-${Date.now().toString(16)}.pdf`;
      FileSaver.saveAs(fileURL, fileName);
    });
  }
  async switchAction(rowAction): Promise<void> {
    switch (rowAction.actionType.name) {
      case ('update'):
        this.openFile(rowAction.data.file_name);
        break;
      case ('hr.payslip.delete'):
        this.deletePayslip(rowAction.data);
        break;
      case ('hr.payslip.download'):
        this.downloadFile(rowAction.data);
        break;
      case ('hr.payslip.import'):
        await this.importPayslip();
        break;
    }
  }

  async getData(event) {
    await Promise.all([this.fillDataTable(event)]);
  }

}
