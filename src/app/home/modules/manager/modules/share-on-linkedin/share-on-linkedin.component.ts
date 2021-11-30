import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShareOnSocialNetworkService } from '@core/services/share-on-social-network/shareonsocialnetwork.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IShareOnSocialNetworkModel } from '@shared/models/shareOnSocialNetwork.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
import { UploadService } from '@core/services/upload/upload.service';
import { map } from 'rxjs/internal/operators/map';

import { ShareOnLinkedinModalComponent } from './share-on-linkedin-modal/share-on-linkedin-modal.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'wid-share-on-social-network',
  templateUrl: './share-on-linkedin.component.html',
  styleUrls: ['./share-on-linkedin.component.scss']
})
export class ShareOnLinkedinComponent implements OnInit {

  linkedinForm: FormGroup;
  id: any;
  text: string;
  access_token: string;
  selectedFile: File = null;
  subscriptionModal: Subscription;
  linkedinEmailAddress: string;
  file: File;
  modals = { modalName: 'shareOnSocialNetwork', modalComponent: ShareOnLinkedinModalComponent };
  url: string;
  imageObject: {
    file: string | ArrayBuffer;
    fileName: string;
  };
   constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private linkedInService: ShareOnSocialNetworkService,
    private localStorageService: LocalStorageService,
    private modalServices: ModalService,
    private utilsService: UtilsService,
    private userService: UserService,
    private uploadService: UploadService,
    private router: Router,
  ) {
     this.route.queryParams
       .subscribe(params => {
         console.log('params =', params);
         this.linkedInService.getIndeedAccessToken(params['code']).subscribe(async (res) => {
           console.log('access token=', res);
         });
         });
     if (window.opener) {
       this.redirectToParentPage();
     } else {
       this.getLinkedinId();
     }
  }
  async ngOnInit(): Promise<void> {
    this.modalServices.registerModals(this.modals);
    this.initForm();

  }
   initForm() {
    this.linkedinForm = this.fb.group({
      title: '',
      text: '',
      image: '',
    });
  }
  async getLinkedinId() {
    if (this.localStorageService.getItem('linkedin_access_token')) {
      this.linkedinEmailAddress = await this.getLinkedinEmail( atob(this.localStorageService.getItem('linkedin_access_token')));
      this.linkedInService.getLinkedinId(atob(this.localStorageService.getItem('linkedin_access_token'))).subscribe(async (res) => {
        this.id = res.id;
        this.access_token = res.access_token;
        this.linkedinEmailAddress = await this.getLinkedinEmail(res.access_token);
      });
    } else {
      this.route.queryParams
        .subscribe(params => {
          console.log('params =', params);
            if (params['code']) {
              this.linkedInService.getLinkedInAccessToken(params['code']).subscribe(async (res) => {
                this.localStorageService.setItem('linkedin_access_token', btoa(res.access_token));
                this.id = res.id;
                this.access_token = res.access_token;
                this.linkedinEmailAddress = await this.getLinkedinEmail(res.access_token);
                this.linkedInService.getPosts(
                  `?published=false&company_email=${await this.getCompanyEmail()}`
                ).subscribe((resSocial) => {
                  const linkedInObject: IShareOnSocialNetworkModel = resSocial[0];
                  if (linkedInObject.image !== '') {
                    this.uploadService.getImageData(linkedInObject.image).subscribe((resImage) => {
                      const reader = new FileReader();
                      reader.readAsDataURL(resImage);
                      reader.onloadend = (() => {
                        const base64data = reader.result;
                        this.latePostOnLinkedin(linkedInObject, base64data);
                      });
                    });
                  } else {
                    this.latePostOnLinkedin(linkedInObject, '');
                  }
                });
              });
            }
          }
        );
    }
  }
  getLinkedinEmail(linkedin_access_token): Promise<string> {
    return new Promise( (resolve) => {
      this.linkedInService.getLinkedinEmail(linkedin_access_token).subscribe( (res) => {
        if (res.data.elements) {
          resolve(res.data.elements[0]['handle~']['emailAddress']);
        } else {
localStorage.removeItem('linkedin_access_token');
        }
      });
    });
  }
  setValueToImageField(event) {
    const reader = new FileReader();
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
    if (event.target.files && event.target.files.length) {
      this.file = fileList[0];
      this.selectedFile = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageObject = {
          file: reader.result,
          fileName: event.target.files[0].name,
        };
        this.linkedinForm.patchValue(
          {
            image: event.target.files[0].name,
          }
        );
      };

    }
  }
  getCompanyEmail() {
    return new Promise( (resolve) => {
      this.userService.connectedUser$
        .subscribe((userInfo) => {
          resolve(userInfo?.company[0].companyKey.email_address);
        });
    });
  }
  latePostOnLinkedin(linkedInObject, base64data) {
    this.linkedInService.postOnLinkedin(this.access_token, this.id, linkedInObject,
      {
        file: base64data,
        fileName: linkedInObject.image,
      }).subscribe((resPost) => {
      if (resPost.status === 401) {
        localStorage.removeItem('linkedin_access_token');
        this.linkedInService.getLinkedinAuthLink().subscribe((resAuth) => {
          window.open(resAuth.url , '_blank').focus();
        });
      } else if (resPost.status === 200) {
        linkedInObject.published = true;
        linkedInObject.ShareOnSocialNetworkKey.linkedin_email = this.linkedinEmailAddress;
        linkedInObject.linkedin_email = linkedInObject.ShareOnSocialNetworkKey.linkedin_email;
        linkedInObject.application_id = linkedInObject.ShareOnSocialNetworkKey.application_id;
        linkedInObject.company_email = linkedInObject.ShareOnSocialNetworkKey.company_email;
        linkedInObject.date = linkedInObject.ShareOnSocialNetworkKey.date;
        this.linkedInService.updatePosts(linkedInObject).subscribe( (resPostUpdate) => {
          this.linkedInService.deletePosts(linkedInObject._id).subscribe( (deleteOldPost) => {
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
          });

        });
      }
    });
  }
  redirectToParentPage() {
    this.route.queryParams
      .subscribe(params => {
        if (params['code']) {
          window.opener.location.href = `${environment.servicmaUrl}${this.router.url.split('?')[0]}?code=${params['code']}`;
        }
      });
    window.close();
  }
  async routeToShareDialog() {
    this.subscriptionModal = this.modalServices.displayModal('shareOnSocialNetwork',
      {
        form: this.linkedinForm.value,
        companyEmail: await this.getCompanyEmail(),
        linkedinEmail: this.access_token ? await this.getLinkedinEmail(this.access_token) : 'not Available',
        fileData: this.file,
        access_token: this.access_token,
        id: this.id,
        imageObject: this.imageObject,
      }, '704px', '500px')
      .subscribe(
        (res) => {
          this.initForm();
        });
  }
}
