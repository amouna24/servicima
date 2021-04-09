import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';

import { ResumeProExpRoutingModule } from './resume-pro-exp-routing.module';
import { ProExpComponent } from './modules/professional-experiences/pro-exp.component';
import { ProExpListComponent } from './modules/professional-experiences-list/pro-exp-list.component';
import { ProExpProjectsComponent } from './modules/professional-experiences-projects/pro-exp-projects.component';
import {MaterialModule} from "@shared/modules/material/material.module";
import {ScrollbarModule} from "@shared/scrollbar/scrollbar.module";

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
    ScrollbarModule
  ],
  exports: [
    ProExpComponent,
    ProExpListComponent,
    ProExpProjectsComponent,
  ]

})
export class ResumeProExpModule { }
