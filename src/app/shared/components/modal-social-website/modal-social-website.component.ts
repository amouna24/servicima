import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from '@core/services/modal/modal.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
@Component({
  selector: 'wid-modal-social-website',
  templateUrl: './modal-social-website.component.html',
  styleUrls: ['./modal-social-website.component.scss']
})
export class ModalSocialWebsiteComponent {
  constructor(public dialogRef: MatDialogRef<ModalSocialWebsiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

}
