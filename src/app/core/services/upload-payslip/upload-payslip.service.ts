import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAssociatePayslip } from '@shared/models/associatePayslip.model';
import { Observable } from 'rxjs';

import { environment } from '@environment/environment';
import { UtilsService } from '@core/services/utils/utils.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UploadPayslipService {

  constructor(private http: HttpClient,
              private utilsService: UtilsService,
              private localStorageService: LocalStorageService) { }

  distributePayslip(file): Observable<any> {
    return this.http.post<any>(`${environment.payslipAssociateApiUrl}/distribute`, file);
  }
  associatePayslip(body: any): Observable<IAssociatePayslip> {
    body['company_id'] = this.utilsService.getCompanyId('ALL', this.utilsService.getApplicationID('ALL'));
    body['language_id'] = this.localStorageService.getItem('language').langId;
    return this.http.post<IAssociatePayslip>(`${environment.payslipAssociateApiUrl}`, body);
  }
  getAssociatedPayslip(filter): Observable<IAssociatePayslip[]> {
    return this.http.get<IAssociatePayslip[]>(`${environment.payslipAssociateApiUrl}${filter}`);
  }
  disableAssociatedPayslip(ID: string): Observable<IAssociatePayslip> {
    return this.http.delete<IAssociatePayslip>(`${environment.payslipAssociateApiUrl}?_id=${ID}`);
  }
  getAssociatedPayslipPaginator(filter: string): Observable<IAssociatePayslip[]> {
    return this.http.get<IAssociatePayslip[]>(`${environment.payslipAssociateApiUrl}/datatable${filter}`);
  }
}
