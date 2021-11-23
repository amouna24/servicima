import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostLinkedinService } from '@core/services/share-on-linkedin/shareonlinkedin.service';
import { ILinkedinPostModel } from '@shared/models/postLinkedin.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IShareOnSocialNetworkModel } from '@shared/models/shareOnSocialNetwork.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';

@Component({
  selector: 'wid-share-on-linkedin',
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
  imageObject: {
    file: string | ArrayBuffer;
    fileName: string;
  };
   constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private linkedInService: PostLinkedinService,
    private localStorageService: LocalStorageService,
    private modalServices: ModalService,
    private utilsService: UtilsService,
    private userService: UserService,
    private uploadService: UploadService,
  ) {
     this.getLinkedinId();
  }
  url: string;
  async ngOnInit(): Promise<void> {
    this.initForm();

  }
   initForm() {
    this.linkedinForm = this.fb.group({
      title: '',
      text: '',
      image: '',
    });
  }
  async publishOnLinkedin() {
    if (this.localStorageService.getItem('linkedin_access_token')) {
      console.log('email linkedin', this.linkedinEmailAddress);
      const linkedinObject: IShareOnSocialNetworkModel = this.linkedinForm.value;
      // @ts-ignore
      linkedinObject.company_email = await this.getCompanyEmail();
      linkedinObject.linkedin_email = this.linkedinEmailAddress;
      linkedinObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      linkedinObject.date = new Date();
      linkedinObject.published = true;
      console.log('form before publish', linkedinObject);
      const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
      // @ts-ignore
      formData.append('file', this.file);
      formData.append('caption', this.imageObject.fileName);
      this.uploadLinkedinImage(formData).then(filename => {
        console.log('image uploaded to local db');
        linkedinObject.image = filename;
        console.log(linkedinObject);
        this.linkedInService.postOnLinkedin(this.access_token, this.id, linkedinObject, this.imageObject).subscribe((resPost) => {
          if (resPost.status === 401) {
            localStorage.removeItem('linkedin_access_token');
            this.linkedInService.getLinkedinAuthLink().subscribe((resAuth) => {
              window.location.href = resAuth.url;
            });
          } else if (resPost.status === 200) {
            this.linkedInService.addPosts(linkedinObject).subscribe( (addPostResult) => {
              console.log('linkedin Object added to db', addPostResult);
              this.initForm();
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
          }
        });
      });

    } else {
      console.log('email linkedin', this.linkedinEmailAddress);
      const linkedinObject: IShareOnSocialNetworkModel = this.linkedinForm.value;
      // @ts-ignore
      linkedinObject.company_email = await this.getCompanyEmail();
      linkedinObject.linkedin_email = 'not available';
      linkedinObject.application_id = this.utilsService.getApplicationID('SERVICIMA');
      linkedinObject.date = new Date();
      linkedinObject.published = false;
      console.log('form before publish', linkedinObject);
      const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
      // @ts-ignore
      formData.append('file', this.file);
      formData.append('caption', this.imageObject.fileName);
      this.uploadLinkedinImage(formData).then(filename => {
        console.log('image uploaded to local db');
        linkedinObject.image = filename;
        this.linkedInService.addPosts(linkedinObject).subscribe( (addPostResult) => {
          this.linkedInService.getLinkedinAuthLink().subscribe( (res) => {
            window.location.href = res.url;
          });
        });
      });
    }

  }
  async getLinkedinId() {
    if (this.localStorageService.getItem('linkedin_access_token')) {
      this.linkedinEmailAddress = await this.getLinkedinEmail(this.localStorageService.getItem('linkedin_access_token'));
      this.linkedInService.getLinkedinId(this.localStorageService.getItem('linkedin_access_token')).subscribe(async (res) => {
        this.id = res.id;
        this.access_token = res.access_token;
        this.linkedinEmailAddress = await this.getLinkedinEmail(res.access_token);
      });
    } else {
      this.route.queryParams
        .subscribe(params => {
            if (params['code']) {
              this.linkedInService.getLinkedInAccessToken(params['code']).subscribe(async (res) => {
                this.localStorageService.setItem('linkedin_access_token', res.access_token);
                this.id = res.id;
                this.access_token = res.access_token;
                this.linkedinEmailAddress = await this.getLinkedinEmail(res.access_token);
                this.linkedInService.getPosts(
                  `?published=false`
                ).subscribe((resSocial) => {
                  const linkedInObject: IShareOnSocialNetworkModel = resSocial[0];
                  console.log('linkedin Object =', linkedInObject);
                  this.uploadService.getImageData(linkedInObject.image).subscribe( (resImage) => {
                    console.log(' result image', resImage);
                    const reader = new FileReader();
                    reader.readAsDataURL(resImage);
                    reader.onloadend = (() => {
                      const base64data = reader.result;
                      console.log(base64data);
                      this.linkedInService.postOnLinkedin(this.access_token, this.id, linkedInObject,
                        {
                          file: base64data,
                          fileName: linkedInObject.image,
                        }).subscribe((resPost) => {
                        if (resPost.status === 401) {
                          localStorage.removeItem('linkedin_access_token');
                          this.linkedInService.getLinkedinAuthLink().subscribe((resAuth) => {
                            window.location.href = resAuth.url;
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
                    });

                  });
                });
              });
            }
          }
        );
    }
  }
  backButton() {
  }
  getLinkedinEmail(linkedin_access_token): Promise<string> {
    return new Promise( (resolve) => {
      this.linkedInService.getLinkedinEmail(linkedin_access_token).subscribe( (res) => {
        resolve(res.data.elements[0]['handle~']['emailAddress']);
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
  async uploadLinkedinImage(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }
}
