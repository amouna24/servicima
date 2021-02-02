import { Component, Input, OnInit } from '@angular/core';
import { indicate } from '@core/services/utils/progress';
import { map } from 'rxjs/internal/operators/map';
import { UserService } from '@core/services/user/user.service';
import { UploadService } from '@core/services/upload/upload.service';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '@core/services/profile/profile.service';

@Component({
  selector: 'wid-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {

  @Input() avatar: any;
  @Input() haveImage: any;
  @Input() modelObject: any;
  selectedFile = { file: null, name: '' };
  loading$ = new Subject<boolean>();

  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
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
    };
    reader.readAsDataURL(file);
    const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
    formData.append('file', file);
    formData.append('caption', file.name);
    this.selectedFile.file = formData;
    this.selectedFile.name = file.name;
  }

  /**
   * @description : Upload Image to Server  with async to promise
   */
  async uploadFile() {
    const filename = await this.uploadService.uploadImage(this.selectedFile.file)
      .pipe(
        indicate(this.loading$),
        map(
          response => response.file.filename
        ))
      .toPromise();
    this.modelObject.email_address = this.modelObject.userKey.email_address;
    this.modelObject.application_id = this.modelObject.userKey.application_id;
    this.modelObject.photo = filename;
    this.profileService.updateUser(this.modelObject).subscribe(
      (res) => {
      },
      (error) => {
        console.log(error);
      }
    );
    this.userService.getImage(filename);
    this.selectedFile.file = null;
  }

  /**
   * @description : Clear  preview  Image
   */
  clearPreview() {
    this.selectedFile = null;
    this.avatar = this.userService.avatar$.getValue();
  }

}
