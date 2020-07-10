import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  downloadPDF(filename, filetype): any {
    return this.http.get('http://127.0.0.1:8013/file/' + filename,
    { responseType: 'blob' });
  }

  uploadImage(file: any) {
    return this.http.post<{ }>(`${environment.userApiUrl}/api/upload`, file)
      .pipe(
        catchError(error => throwError(error)),
        map((response: any) => {
          return response;
        })
      );
  }
  getImage(idFile) {
    return this.http.get(`${environment.userApiUrl}/api/image/` + idFile, {
      responseType: 'blob',
    });
  }
  getImages() {
    return this.http.get(`${environment.userApiUrl}/api/`);

  }

  showFileNames() {
    return this.http.get('http://127.0.0.1:8013/files');
  }

}
