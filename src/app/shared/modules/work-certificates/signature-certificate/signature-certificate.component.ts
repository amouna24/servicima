import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { UploadService } from '@core/services/upload/upload.service';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'wid-signature-certificate',
  templateUrl: './signature-certificate.component.html',
  styleUrls: ['./signature-certificate.component.scss']
})
export class SignatureCertificateComponent implements OnInit {
  selectedFile = { file: File, name: ''};
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService,
    private hrService: HumanRessourcesService,
    private uploadService: UploadService,

  ) { }

  /**************************************************************************
   * @description Upload Image to Server  with async to promise
   *************************************************************************/
  async uploadFile(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        takeUntil(this.destroy$),
        map(response => {
          console.log(response);
          return response.file.filename; })
      )
      .toPromise();
  }
  /**************************************************************************
   * @description Update signature of Certificate
   *************************************************************************/
  async sign(sign: any) {

    this.data.signature = await this.uploadFile(sign);
    this.data.application_id = this.localStorageService.getItem('userCredentials')['application_id'];
    this.hrService.updateWorkCertificate(this.data).subscribe((data) => {
        this.utilsService.openSnackBar('Sign added successfully', 'close', 5000);
      },
      (err) => {
        this.utilsService.openSnackBar('something wrong', 'close', 5000);
      }
    );

  }

  ngOnInit(): void {
  }

}
