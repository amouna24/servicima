import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { id } from '@swimlane/ngx-datatable';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadImage(file: any) {
    return this.http.post<{ }>(`${environment.uploadFileApiUrl}/`, file)
      .pipe(
        catchError(error => throwError(error)),
        map((response: any) => {
          return response;
        })
      );
  }

  getFiles(idFile) {
    return this.http.get(`${environment.uploadFileApiUrl}/file/` + idFile);
  }

  getFilesByName(idFile) {
    return this.http.get(`${environment.uploadFileApiUrl}/` + idFile);
  }

  getImages() {
    return this.http.get(`${environment.userApiUrl}/api/`);

  }

}
