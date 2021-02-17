import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { map } from 'rxjs/internal/operators/map';
import { Subject } from 'rxjs';

import { indicate } from '@core/services/utils/progress';
import { ProfileService } from '@core/services/profile/profile.service';
import { UserService } from '@core/services/user/user.service';
import { UploadService } from '@core/services/upload/upload.service';
import { userType } from '@shared/models/userProfileType.model';

@Component({
  selector: 'wid-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})

export class ProfileImageComponent implements OnInit {

  @Input() singleUpload = false;
  @Input() userType: userType;
  @Input() avatar: any;
  @Input() haveImage: any;
  @Input() modelObject: any;

  @Output() newFile = new EventEmitter<FormData>();

  page = Math.random();
  selectedFile = { file: null, name: '' };
  loading$ = new Subject<boolean>();
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private profileService: ProfileService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * @description : set the Image to UpLoad and preview
   */
  previewFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
     this.avatar = reader.result as string;
     this.haveImage = 'have image';
    };
   reader.readAsDataURL(file);
      const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
     formData.append('file', file);
     formData.append('caption', file.name);
     this.selectedFile.file = formData;
     this.selectedFile.name = file.name;
     this.newFile.emit(formData);
  }

  /**
   * @description : Upload Image to Server  with async to promise
   */
  async uploadFile() {
    /*** Create file after uploading selected Image ***/
    const filename = await this.uploadService.uploadImage(this.selectedFile.file)
      .pipe(
        indicate(this.loading$),
        map(
          response => response.file.filename
        ))
      .toPromise();
    /*** save the name of selected File ***/
    if ( this.userType === userType.UT_USER) {
      this.modelObject.email_address = this.modelObject.userKey.email_address;
      this.modelObject.application_id = this.modelObject.userKey.application_id;
      this.modelObject.photo = filename;
      this.profileService.updateUser(this.modelObject).subscribe(
        () => {
          this.userService.haveImage('have image');
        },
        (error) => {
          console.error(error);
        }
      );
      this.userService.getImage(filename);
    } else if (this.userType === userType.UT_CONTRACTOR) {
      console.log('work in progress ...');
    }

    this.selectedFile.file = null;
  }

  /**
   * @description : Clear  preview  Image
   */
  clearPreview() {
    this.selectedFile = null;
    if (this.userType === userType.UT_USER) {
      this.avatar = this.userService.avatar$.getValue();
    } else if (this.userType === userType.UT_CONTRACTOR) {
      console.log('work in progress ...');
    }
  }
}
