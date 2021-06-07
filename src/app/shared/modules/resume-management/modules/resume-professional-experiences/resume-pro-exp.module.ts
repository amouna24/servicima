import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MaterialModule } from '@shared/modules/material/material.module';
import { ScrollbarModule } from '@shared/scrollbar/scrollbar.module';
import { SharedModule } from '@shared/shared.module';

import { ResumeProExpRoutingModule } from './resume-pro-exp-routing.module';
import { ProExpComponent } from './modules/professional-experiences/pro-exp.component';
import { ProExpProjectsComponent } from './modules/professional-experiences-projects/pro-exp-projects.component';
import { ProjectSectionComponent } from './modules/project-section/project-section.component';

@NgModule({
  declarations: [
    ProExpComponent,
    ProExpProjectsComponent,
    ProjectSectionComponent,
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
    ProExpProjectsComponent,
  ],
  providers: [
    DatePipe,
  ],

})
export class ResumeProExpModule { }
