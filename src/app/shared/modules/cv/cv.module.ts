import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CvRoutingModule } from './cv-routing.module';
import { CvComponent } from './cv.component';

@NgModule({
  declarations: [CvComponent],
  imports: [
    CommonModule,
    CvRoutingModule
  ]
})
export class CvModule { }
