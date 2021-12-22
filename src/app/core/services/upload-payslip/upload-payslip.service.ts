import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAssociatePayslip } from '@shared/models/associatePayslip.model';
import { Observable } from 'rxjs';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadPayslipService {

  constructor(private http: HttpClient) { }

  distributePayslip(file): Observable<any> {
    return this.http.post<any>(`${environment.payslipAssociateApiUrl}/distribute`, file);
  }
  associatePayslip(body: any): Observable<IAssociatePayslip> {
    return this.http.post<IAssociatePayslip>(`${environment.payslipAssociateApiUrl}`, body);
  }
  getAssociatedPayslip(filter): Observable<IAssociatePayslip[]> {
    return this.http.get<IAssociatePayslip[]>(`${environment.payslipAssociateApiUrl}${filter}`);
  }
  disableAssociatedPayslip(ID: string): Observable<IAssociatePayslip> {
    return this.http.delete<IAssociatePayslip>(`${environment.payslipAssociateApiUrl}?_id=${ID}`);
  }
}
