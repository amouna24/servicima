import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  imageSubject$ = new Subject<string>();
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) { }

  uploadImage(file: any) {
    return this.http.post(`${environment.uploadFileApiUrl}/`, file)
      .pipe(
        catchError(error => throwError(error)),
        map((response: any) => {
          return response;
        })
      );
  }

  /**
   * @description : Get files
   * @param idFile: id file
   */
  getFiles(idFile) {
    return this.http.get(`${environment.uploadFileApiUrl}/file/` + idFile);
  }

  /**
   * @description : Get files by name
   * @param idFile: id file
   */
  getFilesByName(idFile) {
    return this.http.get(`${environment.uploadFileApiUrl}/` + idFile)
      .pipe(
        catchError(error => throwError(error)),
        map((response: any) => {
          return response;
        })
      );
  }

  /**
   * @description : Get images
   *  return image
   */
  getImages() {
    return this.http.get(`${environment.userApiUrl}/api/`);
  }

  /**
   * @description : GET IMAGE FROM BACK AS BLOB
   *  create Object from blob and convert to url
   */
  getImage(idFile) {
    return this.http.get(`${environment.uploadFileApiUrl}/image/` + idFile, {
      responseType: 'blob',
    }).pipe(
      catchError(error => throwError(error)),
      map(
        (data) => {
          const unsafeImageUrl = URL.createObjectURL(data);
          return this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        }
      )
    ).toPromise();
  }
  deleteImage(idFile) {
    return this.http.delete(`${environment.uploadFileApiUrl}/delete/${idFile}`);
  }

  /**
   * @description : delete file
   *  @param idFile: id file
   */
  deleteFile(idFile) {
    return this.http.delete(`${environment.uploadFileApiUrl}/delete/` + idFile);
  }

  /**************************************************************************
   * @description Emit color
   * @param image
   *************************************************************************/
  emitImage(image: string): void {
    this.imageSubject$.next(image);
  }

}
