import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
}
