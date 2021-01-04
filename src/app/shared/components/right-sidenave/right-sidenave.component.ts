import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { UserService } from '@core/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadService } from '@core/services/upload/upload.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { indicate } from '@core/services/utils/progress';
import { IUserModel } from '@shared/models/user.model';
import { Subject } from 'rxjs';
import { AuthService } from '@widigital-group/auth-npm-front';

@Component({
  selector: 'wid-right-sidenave',
  templateUrl: './right-sidenave.component.html',
  styleUrls: ['./right-sidenave.component.scss'],
})
export class RightSidenaveComponent implements OnInit, OnDestroy {

  sidebarState: string;
  user: IUserModel;
  avatar: any;
  photo: FormData;
  loading$ = new Subject<boolean>();

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private userService: UserService,
    private uploadService: UploadService,
    private sanitizer: DomSanitizer,
  ) {

  }

  ngOnInit(): void {
    this.sidenavService.rightSidebarStateObservable$.
    subscribe((newState: string) => {
      this.sidebarState = newState;
    }, (err) => {
      console.error(err);
    });
    this.userService.connectedUser$.subscribe((data) => {
      if (!!data) {
        this.user = data['user'][0];
      }
    });
  }

  toggleSideNav() {
    this.sidenavService.toggleRightSideNav();
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
    this.photo = formData;
  }

  /**
   * @description : Upload Image to Server  with async to promise
   */
  async uploadFile(formData) {
    return this.uploadService.uploadImage(formData)
      .pipe(
        indicate(this.loading$),
        map(
          response => response.file.filename
        ))
      .toPromise();
  }

  /**
   * @description : Clear  preview  Image
   */
  clearPreview() {
    this.photo = null;
    this.avatar = null;
  }

  /**
   * @description : GET IMAGE FROM BACK AS BLOB
   *  create Object from blob and convert to url
   */
  getImage(id) {
    this.uploadService.getImage(id).subscribe(
      data => {
        const unsafeImageUrl = URL.createObjectURL(data);
        this.avatar = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      }, error => {
        console.log(error);
      });
  }

  /**
   * @description logout: remove fingerprint and local storage
   * navigate from login
   */
  logout(): void {
    this.authService.logout().subscribe(() => {
        this.sidenavService.toggleRightSideNav();
        localStorage.removeItem('userCredentials');
        localStorage.removeItem('currentToken');
        this.userService.connectedUser$.next(null);
        this.router.navigate(['/auth/login']);
      },
      (err) => {
        console.error(err);
      });
  }

  /**************************************************************************
   * @description Destroy All subscriptions declared with takeUntil operator
   *************************************************************************/
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
