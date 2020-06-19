import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IContract } from '@shared/models/contract.model';

import { environment } from '../../../../environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  // tslint:disable-next-line:max-line-length
  userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaW1lbi5hbW1hckB3aWRpZ2l0YWwtZ3JvdXAuY29tIiwiaWF0IjoxNTkyNDkyMTEyLCJleHAiOjE1OTI1Nzg1MTJ9.jdyfVISHsQ__BGz74wYjScpA-QmngvWKGX9LHae8ohA';

  constructor(
    private httpClient: HttpClient,
    ) { }

  /**
   * @description Get Contract List
   */
  getContracts(): Observable<IContract[]> {
    const header = new HttpHeaders().set('Authorization', `Bearer ${ this.userToken }`
    );
    return this.httpClient.get<IContract[]>(`${environment.contractApiUrl}`, { headers: header});
  }

  /**
   * @description Add new Contract
   * @param Contract Contract Model
   */
  addContact(Contract: IContract) {
    const header = new HttpHeaders().set('Authorization', `Bearer ${ this.userToken }`
    );
    return this.httpClient.post<IContract>(`${environment.contractApiUrl}`, Contract, { headers: header});
  }
}
