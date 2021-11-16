import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadPayslipService {

  constructor(private http: HttpClient) { }

  distributePayslip(file): Observable<any> {
    return this.http.post<any>(`${environment.payslipAssociateApiUrl}/distribute`, file);
  }
  associatePayslip(body: any) {
    return this.http.post<any>(`${environment.payslipAssociateApiUrl}`, body);
  }
  getAssociatedPayslip(filter) {
    return this.http.get<any>(`${environment.payslipAssociateApiUrl}${filter}`);
  }
}
