import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectCollaboratorService {
  constructor(private httpClient: HttpClient, ) {
  }

  /**************************************************************************
   * @description  Get project collaborator
   * @param company company Email
   * @param project project code
   *************************************************************************/
  getProjectCollaborator(company: string, project: string): Observable<any> {
    return this.httpClient.get(`${environment.projectCollaboratorApiUrl}/?company_email=${company}&project_code=${project}`);
  }

}
