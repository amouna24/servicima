import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IResumeUploadModel } from '@shared/models/resumeUpload.model';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadResumeService {

  constructor(
    private http: HttpClient,
  ) { }
  uploadResume(file: any) {
    console.log(file);
    return this.http.post(`${environment.uploadResumeFileApiUrl}/`, file)
      .pipe(
        catchError(error => throwError(error)),
        map((response: any) => {
          console.log(response);
          return response;
        })
      );
  }
  getResume(filter: string): Observable<IResumeUploadModel[]> {
    return this.http.get<IResumeUploadModel[]>(`${environment.uploadResumeFileApiUrl}/${filter}`);
  }
  updateResume(file: any) {
    return this.http.put(`${environment.uploadResumeFileApiUrl}/`, file)
      .pipe(
        catchError(error => throwError(error)),
        map((response: any) => {
          console.log(response);
          return response;
        })
      );
  }
}
