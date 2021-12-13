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
  formDataFile: FormData;
  modals = { modalName: 'shareOnSocialNetwork', modalComponent: ShareOnLinkedinModalComponent};
  url: string;
  imageObject: {
    file: string | ArrayBuffer;
    fileName: string;
    fileType: string;
    fileUrl?: string;
  };
  pageAccessToken: string;
  pageId: string;
  facebookAccessToken: string;
  userId: string;
  uploadUrl = `${environment.uploadFileApiUrl}/show/`;
  extension: string;
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
    if (window.opener) {
      this.redirectToParentPage();
    } else {
      this.getLinkedinId();
      this.getFacebookData();
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
      this.linkedinEmailAddress = await this.getLinkedinEmail(atob(this.localStorageService.getItem('linkedin_access_token')));
      this.linkedInService.getLinkedinId(atob(this.localStorageService.getItem('linkedin_access_token'))).subscribe(async (res) => {
        this.id = res.id;
        this.access_token = res.access_token;
        this.linkedinEmailAddress = await this.getLinkedinEmail(res.access_token);
      });
    } else {
      this.route.queryParams
        .subscribe(params => {
            if (params['code'] && params['state'] === 'LINKEDIN') {
              this.linkedInService.getLinkedInAccessToken(params['code']).subscribe(async (res) => {
                this.localStorageService.setItem('linkedin_access_token', btoa(res.access_token));
                this.id = res.id;
                this.access_token = res.access_token;
                this.linkedinEmailAddress = await this.getLinkedinEmail(res.access_token);
                this.linkedInService.getPosts(
                  `?published=false&social_network_name=LINKEDIN&company_email=${await this.getCompanyEmail()}`
                ).subscribe((resSocial) => {
                  const linkedInObject: IShareOnSocialNetworkModel = resSocial[0];
                  if (linkedInObject.image !== '') {
                    if (linkedInObject.image.split('.').pop() !== 'pdf') {
                      this.uploadService.getImageData(linkedInObject.image).subscribe((resImage) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(resImage);
                        reader.onloadend = (() => {
                          const base64data = reader.result;
                          this.latePostOnLinkedin(linkedInObject, base64data, linkedInObject.image.split('.').pop());
                        });
                      });
                    } else {
                      const fileUrl = this.uploadUrl + linkedInObject.image;
                      this.latePostOnLinkedin(linkedInObject, fileUrl, linkedInObject.image.split('.').pop());
                    }

                  } else {
                    this.latePostOnLinkedin(linkedInObject, '', '');
                  }
                });
              });
            }
          }
        );
    }
  }

  getLinkedinEmail(linkedin_access_token): Promise<string> {
    return new Promise((resolve) => {
      this.linkedInService.getLinkedinEmail(linkedin_access_token).subscribe((res) => {
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
      let formData: FormData;
      formData = new FormData(); // CONVERT IMAGE TO FORMDATA
      formData.append('file', fileList[0]);
      formData.append('caption', fileList[0].name);
      this.extension =  fileList[0].name.split('.').pop();
      this.formDataFile = formData;
      this.selectedFile = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageObject = {
          file: reader.result,
          fileName: event.target.files[0].name,
          fileType: fileList[0].name.split('.').pop()
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
    return new Promise((resolve) => {
      this.userService.connectedUser$
        .subscribe((userInfo) => {
          resolve(userInfo?.company[0].companyKey.email_address);
        });
    });
  }

  latePostOnLinkedin(linkedInObject, fileData, fileType) {
    this.linkedInService.postOnLinkedin(this.access_token, this.id, linkedInObject,
      {
        file: fileType === 'pdf' ? '' : fileData,
        fileName: linkedInObject.image,
        fileType,
        fileUrl: fileType === 'pdf' ? fileData : '',
      }).subscribe((resPost) => {
      if (resPost.status === 401) {
        localStorage.removeItem('linkedin_access_token');
        this.linkedInService.getLinkedinAuthLink().subscribe((resAuth) => {
          window.open(resAuth.url, '_blank').focus();
        });
      } else if (resPost.status === 200) {
        linkedInObject.published = true;
        linkedInObject.social_network_name = linkedInObject.ShareOnSocialNetworkKey.social_network_name;
        linkedInObject.ShareOnSocialNetworkKey.social_network_email = this.linkedinEmailAddress;
        linkedInObject.social_network_email = linkedInObject.ShareOnSocialNetworkKey.social_network_email;
        linkedInObject.application_id = linkedInObject.ShareOnSocialNetworkKey.application_id;
        linkedInObject.company_email = linkedInObject.ShareOnSocialNetworkKey.company_email;
        linkedInObject.date = linkedInObject.ShareOnSocialNetworkKey.date;
        console.log('share on linkedin object ', linkedInObject);
        this.linkedInService.updatePosts(linkedInObject).subscribe((resPostUpdate) => {
          this.linkedInService.deletePosts(linkedInObject._id).subscribe((deleteOldPost) => {
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
        if (params['code'] && params['state']) {
          window.opener.location.href = `${environment.servicmaUrl}${this.router.url.split('?')[0]}?code=${params['code']}&state=${params['state']}`;
        } else {
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
        facebookEmail: this.facebookAccessToken ? await this.getFacebookUserEmail() : 'not available',
        facebookAccessToken: this.facebookAccessToken,
        facebookUserId: this.userId,
        facebookPageId: this.pageId,
        facebookPageAccessToken: this.pageAccessToken,
        fileData: this.file,
        access_token: this.access_token,
        formDataFile: this.formDataFile,
        id: this.id,
        imageObject: this.imageObject,
      }, '704px', '500px')
      .subscribe(
        (res) => {
          this.initForm();
          this.imageObject = {
            file: null,
            fileName: null,
            fileType: null,
            fileUrl: undefined
          };
        });
  }

  private getFacebookData() {
    if (this.localStorageService.getItem('facebook_access_token')) {
      this.facebookAccessToken = atob(this.localStorageService.getItem('facebook_access_token'));
      this.getFacebookDataWithLocalStorage(this.facebookAccessToken);
    } else {
      this.getFacebookDataWithAuthCode();
    }
  }

  getFacebookDataWithLocalStorage(accessToken) {
  this.linkedInService.getFacebookPageData(accessToken).subscribe( (facebookResults) => {
    this.pageAccessToken = facebookResults.pageAccessToken;
    this.pageId = facebookResults.pageId;
    this.userId = facebookResults.userId;
  });
  }

  PostOnFacebookPage(facebookObject: IShareOnSocialNetworkModel) {
    if (facebookObject.image !== '') {
      this.uploadService.getImageData(facebookObject.image).subscribe((resImage) => {
        const reader = new FileReader();
        reader.readAsDataURL(resImage);
        reader.onloadend = (() => {
          const base64data = reader.result;
          this.latePostOnFacebookPage(
            facebookObject,
            { file: base64data, fileName: facebookObject.image});
        });
      });
    } else {
      this.latePostOnFacebookPage(facebookObject);
    }
  }

  getFacebookDataWithAuthCode() {
    this.route.queryParams
      .subscribe(params => {
        if (params['code'] && params['state'] === 'FACEBOOK#_') {
          this.linkedInService.getFacebookId(params['code']).subscribe(async (res) => {
            this.localStorageService.setItem('facebook_access_token', btoa(res.userAccessToken));
            this.userId = res.userId;
            this.facebookAccessToken = res.userAccessToken;
            this.pageAccessToken = res.pageAccessToken;
            this.pageId = res.pageId;
            this.linkedInService.getPosts(
              `?published=false&social_network_name=FACEBOOK&company_email=${await this.getCompanyEmail()}`
            ).subscribe((resSocial) => {
              const facebookObject: IShareOnSocialNetworkModel = resSocial[0];
              this.PostOnFacebookPage(facebookObject);
            });
          });
        }
      });
  }
  latePostOnFacebookPage(facebookObject, imageObject?) {
    this.linkedInService.postOnFacebookPage(
      this.pageAccessToken,
      this.pageId,
      facebookObject,
      imageObject ? imageObject : { file: '', fileName: ''}).subscribe(async (resFacebookPost) => {
      if (resFacebookPost.body.id) {
        facebookObject.social_network_name = facebookObject.ShareOnSocialNetworkKey.social_network_name;
        facebookObject.published = true;
        facebookObject.ShareOnSocialNetworkKey.social_network_email =  await this.getFacebookUserEmail();
        facebookObject.social_network_email = await this.getFacebookUserEmail();
        facebookObject.application_id = facebookObject.ShareOnSocialNetworkKey.application_id;
        facebookObject.company_email = facebookObject.ShareOnSocialNetworkKey.company_email;
        facebookObject.date = facebookObject.ShareOnSocialNetworkKey.date;
        this.linkedInService.updatePosts(facebookObject).subscribe((resPostUpdate) => {
          this.linkedInService.deletePosts(facebookObject._id).subscribe((deleteOldPost) => {
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
          });
        });
      } else {
        const confirmation = {
          code: 'error',
          title: 'Share post on Facebook',
          description: `We cannot share your post, please try again`,
        };
        this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
          .subscribe(
            (resModal) => {
              if (resModal === true) {
              }
              this.subscriptionModal.unsubscribe();
            }
          );
      }
    });
  }
  getFacebookUserEmail(): Promise<any> {
    return new Promise( (resolve) => {
      this.linkedInService.getFacebookEmail(this.facebookAccessToken, this.userId).subscribe( (emailResult: any) => {
        resolve(emailResult.email);
      });
    });
  }
}
