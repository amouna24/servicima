import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MaterialModule } from '@shared/modules/material/material.module';
import { ScrollbarModule } from '@shared/scrollbar/scrollbar.module';
import { SharedModule } from '@shared/shared.module';

import { ResumeProExpRoutingModule } from './resume-pro-exp-routing.module';
import { ProExpComponent } from './modules/professional-experiences/pro-exp.component';
import { ProExpListComponent } from './modules/professional-experiences-list/pro-exp-list.component';
import { ProExpProjectsComponent } from './modules/professional-experiences-projects/pro-exp-projects.component';

@NgModule({
  declarations: [
    ProExpComponent,
    ProExpListComponent,
    ProExpProjectsComponent,
  ],
  imports: [
    CommonModule,
    ResumeProExpRoutingModule,
    FlexModule,
    MaterialModule,
    ScrollbarModule,
    SharedModule,
  ],
  exports: [
    ProExpComponent,
    ProExpListComponent,
    ProExpProjectsComponent,
  ]

})
export class ResumeProExpModule { }
