import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContract } from '@shared/models/contract.model';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(
    private httpClient: HttpClient,
    ) { }

  /**
   * @description Get Contract List
   */
  getContracts(): Observable<IContract[]> {
    return this.httpClient.get<IContract[]>(`${environment.contractApiUrl}`);
  }

  /**
   * @description Add new Contract
   * @param Contract Contract Model
   */
  addContact(Contract: IContract): Observable<any> {
    return this.httpClient.post<IContract>(`${environment.contractApiUrl}`, Contract);
  }
}
