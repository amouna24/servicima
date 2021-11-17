import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostLinkedinService } from '@core/services/share-on-linkedin/shareonlinkedin.service';
import { ILinkedinPostModel } from '@shared/models/postLinkedin.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResumeService } from '@core/services/resume/resume.service';

import { environment } from '../../../../../../environments/environment';

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
  file: File;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private linkedInService: PostLinkedinService,
    private localStorageService: LocalStorageService,
    private resumeService: ResumeService,
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
    });
  }
  publishOnLinkedin() {
    const linkedinObject: ILinkedinPostModel = this.linkedinForm.value;

          this.linkedInService.postOnLinkedin(linkedinObject, this.access_token, this.id).subscribe((res) => {
            console.log('res=', res);
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
  getLinkedinAuthData() {
  }
  backButton() {
  }
  setValueToImageField(event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    console.log('file list =', fileList);
    if (fileList) {
      this.linkedinForm.controls.file.setValue(fileList[0].name);
      this.file = fileList[0];
      console.log('this.file =', this.file);
    }  }
}
