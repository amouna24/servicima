import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostLinkedinService } from '@core/services/share-on-linkedin/shareonlinkedin.service';
import { ILinkedinPostModel } from '@shared/models/postLinkedin.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';

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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private linkedInService: PostLinkedinService,
    private localStorageService: LocalStorageService,
    private modalServices: ModalService
  ) {
    this.getLinkedinId();
  }
  url: string;
  showFirstOne: boolean;
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.linkedinForm = this.fb.group( {
      title: '',
      text: '',
      file: '',
      fileName: '',
    });
  }
  publishOnLinkedin() {
    const linkedinObject: ILinkedinPostModel = this.linkedinForm.value;
          this.linkedInService.postOnLinkedin(this.access_token, this.id, linkedinObject).subscribe((res) => {
            console.log('res=', res);
            if (res.status === 401) {
              localStorage.removeItem('linkedin_access_token');
              this.linkedInService.getLinkedinAuthLink().subscribe( (resAuth) => {
                window.location.href = resAuth.url;
              });
            } else if (res.status === 200) {
              this.initForm();
              const confirmation = {
                code: 'info',
                title: 'Share post on linkedin',
                description: `Your post is shared successfully`,
              };
              this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
                .subscribe(
                  (resModal) => {
                    if (res === true) {
                    }
                    this.subscriptionModal.unsubscribe();
                  }
                );
            }
          });
  }
  getLinkedinId() {
    if (this.localStorageService.getItem('linkedin_access_token')) {
      this.linkedInService.getLinkedinId(this.localStorageService.getItem('linkedin_access_token')).subscribe( (res) => {
        this.id = res.id;
        this.access_token = res.access_token;
      });
    } else {
      this.route.queryParams
        .subscribe(params => {
            if (params['code']) {
              this.linkedInService.getLinkedInAccessToken(params['code']).subscribe( (res) => {
                this.localStorageService.setItem('linkedin_access_token', res.access_token);
                this.id = res.id;
                this.access_token = res.access_token;
              });
            } else {
              this.linkedInService.getLinkedinAuthLink().subscribe( (res) => {
                window.location.href = res.url;
              });
            }
          }
        );
    }
  }
  backButton() {
  }

setValueToImageField(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.linkedinForm.patchValue({
          file: reader.result,
          fileName: event.target.files[0].name,
        });
      };
    }
  }
}
