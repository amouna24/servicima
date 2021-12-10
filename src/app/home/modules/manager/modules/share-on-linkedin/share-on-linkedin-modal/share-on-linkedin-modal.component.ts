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

import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'wid-share-on-social-network-modal',
  templateUrl: './share-on-linkedin-modal.component.html',
  styleUrls: ['./share-on-linkedin-modal.component.scss']
})
export class ShareOnLinkedinModalComponent implements OnInit {
  subscriptionModal: Subscription;
  loadingLabel: boolean;
  loadingFacebookLabel: boolean;
  uploadUrl = `${environment.uploadFileApiUrl}/show/`;
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
      linkedinObject.social_network_name = 'LINKEDIN';
      linkedinObject.company_email = this.data.companyEmail;
      linkedinObject.social_network_email = this.data.linkedinEmail;
      linkedinObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      linkedinObject.date = new Date();
      linkedinObject.published = true;
      if (linkedinObject.image) {
        const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
        // @ts-ignore
        formData.append('file', this.data.fileData);
        formData.append('caption', this.data.form.image);
        this.uploadImage(formData).then(filename => {
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
      linkedinObject.social_network_email = 'not available';
      linkedinObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      linkedinObject.date = new Date();
      linkedinObject.published = false;
      if (this.data.fileData) {
        const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
        formData.append('file', this.data.fileData);
        formData.append('caption', this.data.form.image);
        this.uploadImage(formData).then(filename => {
          linkedinObject.image = filename;
          this.addLinkedinPostAndRedirect(linkedinObject);
        });
      } else {
        this.addLinkedinPostAndRedirect(linkedinObject);
      }

    }

  }
  async uploadImage(formData) {
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
  addLinkedinPostAndRedirect(linkedinObject) {
    this.socialNetworkService.addPosts(linkedinObject).subscribe( (addPostResult) => {
      this.socialNetworkService.getLinkedinAuthLink().subscribe( (res) => {
        window.open(res.url , '', 'width=600, height=500, left=700,top=700').focus();
      });
    });
  }
  addFacebookPostAndRedirect(facebookObject) {
    this.socialNetworkService.addPosts(facebookObject).subscribe( (addPostResult) => {
      this.socialNetworkService.getFacebookAuthLink().subscribe( (res) => {
        window.open(res.url , '', 'width=600, height=500, left=700,top=700').focus();
      });
    });
  }
  shareOnFacebook() {
    this.socialNetworkService.getFacebookAuthLink().subscribe( (res) => {
      window.location.href = res.url;
    });
  }
  async publishOnFacebook() {
    this.loadingFacebookLabel = true;
    if (this.localStorageService.getItem('facebook_access_token')) {
      const facebookObject: IShareOnSocialNetworkModel = this.data.form;
      // @ts-ignore
      facebookObject.social_network_name = 'FACEBOOK';
      facebookObject.company_email = this.data.companyEmail;
      facebookObject.social_network_email = this.data.facebookEmail;
      facebookObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      facebookObject.date = new Date();
      facebookObject.published = true;
      if (facebookObject.image) {
        const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
        // @ts-ignore
        formData.append('file', this.data.fileData);
        formData.append('caption', this.data.form.image);
        this.uploadImage(formData).then(filename => {
          facebookObject.image = filename;
          this.data.imageObject.fileUrl = this.uploadUrl + filename;
          this.postOnFacebook(facebookObject, this.data.imageObject);
        });
      } else {
        this.postOnFacebook(facebookObject, {
            file: '',
            fileName: '',
            fileType: '',
            fileUrl: '',
          }
        );
      }
    } else {
      const facebookObject: IShareOnSocialNetworkModel = this.data.form;
      // @ts-ignore
      facebookObject.social_network_name = 'FACEBOOK';
      facebookObject.company_email = this.data.companyEmail;
      facebookObject.social_network_email = 'not available';
      facebookObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      facebookObject.date = new Date();
      facebookObject.published = false;
      if (this.data.fileData) {
        const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
        formData.append('file', this.data.fileData);
        formData.append('caption', this.data.form.image);
        this.uploadImage(formData).then(filename => {
          facebookObject.image = filename;
          this.addFacebookPostAndRedirect(facebookObject);
        });
      } else {
        this.addFacebookPostAndRedirect(facebookObject);
      }

    }

  }
  postOnFacebook(facebookObject, imageObject) {
    this.socialNetworkService
      .postOnFacebookPage(
        this.data.facebookPageAccessToken,
        this.data.facebookPageId,
        facebookObject,
        imageObject).subscribe((resPost) => {
      if (resPost.body.id) {
        this.socialNetworkService.addPosts(facebookObject).subscribe( (addPostResult) => {
          const confirmation = {
            code: 'info',
            title: 'Share post on Facebook',
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
      } else {
        const confirmation = {
          code: 'error',
          title: 'Share post on Facebook',
          description: `Your post is not shared, try again `,
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

      }
    });
    }
}
