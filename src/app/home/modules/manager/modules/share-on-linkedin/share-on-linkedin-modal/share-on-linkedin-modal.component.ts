import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IShareOnSocialNetworkModel } from '@shared/models/shareOnSocialNetwork.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { ShareOnSocialNetworkService } from '@core/services/share-on-social-network/shareonsocialnetwork.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-share-on-social-network-modal',
  templateUrl: './share-on-linkedin-modal.component.html',
  styleUrls: ['./share-on-linkedin-modal.component.scss']
})
export class ShareOnLinkedinModalComponent implements OnInit {
  subscriptionModal: Subscription;
  loadingLabel: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private  localStorageService: LocalStorageService,
    private  utilsService: UtilsService,
    private  uploadService: UploadService,
    private  socialNetworkService: ShareOnSocialNetworkService,
    private  modalServices: ModalService,
    private dialogRef: MatDialogRef<ShareOnLinkedinModalComponent>

  ) { }
  ngOnInit(): void {

  }
  async publishOnLinkedin() {
    this.loadingLabel = true;
    if (this.localStorageService.getItem('linkedin_access_token')) {
      const linkedinObject: IShareOnSocialNetworkModel = this.data.form;
      // @ts-ignore
      linkedinObject.company_email = this.data.companyEmail;
      linkedinObject.linkedin_email = this.data.linkedinEmail;
      linkedinObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      linkedinObject.date = new Date();
      linkedinObject.published = true;
      if (linkedinObject.image) {
        const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
        // @ts-ignore
        formData.append('file', this.data.fileData);
        formData.append('caption', this.data.form.image);
        this.uploadLinkedinImage(formData).then(filename => {
          linkedinObject.image = filename;
          this.postOnLinkedin(linkedinObject, this.data.imageObject);
        });
      } else {
        this.postOnLinkedin(linkedinObject, {
            file: '',
            fileName: '',
          }
        );
      }
    } else {
      const linkedinObject: IShareOnSocialNetworkModel = this.data.form;
      // @ts-ignore
      linkedinObject.company_email = this.data.companyEmail;
      linkedinObject.linkedin_email = 'not available';
      linkedinObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      linkedinObject.date = new Date();
      linkedinObject.published = false;
      if (this.data.fileData) {
        const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
        formData.append('file', this.data.fileData);
        formData.append('caption', this.data.form.image);
        this.uploadLinkedinImage(formData).then(filename => {
          linkedinObject.image = filename;
          this.addPostAndRedirect(linkedinObject);
        });
      } else {
        this.addPostAndRedirect(linkedinObject);
      }

    }

  }
  async uploadLinkedinImage(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }
  postOnLinkedin(linkedinObject, imageObject) {
    this.socialNetworkService.postOnLinkedin(this.data.access_token, this.data.id, linkedinObject, imageObject).subscribe((resPost) => {
      if (resPost.status === 401) {
        localStorage.removeItem('linkedin_access_token');
        this.socialNetworkService.getLinkedinAuthLink().subscribe((resAuth) => {
          window.location.href = resAuth.url;
        });
      } else if (resPost.status === 200) {
        this.socialNetworkService.addPosts(linkedinObject).subscribe( (addPostResult) => {
          const confirmation = {
            code: 'info',
            title: 'Share post on linkedin',
            description: `Your post is shared successfully`,
          };
          this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
            .subscribe(
              (resModal) => {
                if (resModal === true) {
                }
                this.subscriptionModal.unsubscribe();
              }
            );
          this.dialogRef.close();

        });
      }
    });
  }
  addPostAndRedirect(linkedinObject) {
    this.socialNetworkService.addPosts(linkedinObject).subscribe( (addPostResult) => {
      this.socialNetworkService.getLinkedinAuthLink().subscribe( (res) => {
        window.open(res.url , '', 'width=600, height=500, left=700,top=700').focus();
      });
    });
  }

  shareOnIndeed() {
    this.socialNetworkService.getIndeedAuthLink().subscribe( (res) => {
      window.location.href = res.url;
      console.log('indeed =', res);
    } );
  }
}
