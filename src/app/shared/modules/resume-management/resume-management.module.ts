import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MaterialModule } from '@shared/modules/material/material.module';
import { ScrollbarModule } from '@shared/scrollbar/scrollbar.module';
import { SharedModule } from '@shared/shared.module';
import { LOCALE_ID } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ResumeManagementRoutingModule } from './resume-management-routing.module';

import { ResumeGeneralInformationComponent } from './modules/resume-general-informations/resume-general-information.component';
import { ResumeLanguageComponent } from './modules/resume-languages/resume-language.component';
import { ResumeInterventionComponent } from './modules/resume-interventions/resume-intervention.component';
import { ResumeTechSkillComponent } from './modules/resume-technical-skills/resume-tech-skill.component';
import { ResumeDynamicSectionComponent } from './modules/resume-dynamic-section/resume-dynamic-section.component';
import { ResumeFuncSkillComponent } from './modules/resume-functional-skills/resume-func-skill.component';
import { ResumeCertifDiplomaComponent } from './modules/resume-certification-diploma/resume-certif-diploma.component';
import { ResumeDoneComponent } from './modules/resume-done/resume-done.component';
import { ResumeCertificationsComponent } from './modules/resume-certifications/resume-certifications.component';
@NgModule({
  declarations: [
    ResumeGeneralInformationComponent,
    ResumeLanguageComponent,
    ResumeInterventionComponent,
    ResumeTechSkillComponent,
    ResumeDynamicSectionComponent,
    ResumeFuncSkillComponent,
    ResumeCertifDiplomaComponent,
    ResumeDoneComponent,
    ResumeCertificationsComponent,
  ],
  imports: [
    CommonModule,
    ResumeManagementRoutingModule,
    FlexModule,
    MaterialModule,
    ScrollbarModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    ResumeGeneralInformationComponent,
    ResumeLanguageComponent,
    ResumeInterventionComponent,
    ResumeTechSkillComponent,
    ResumeDynamicSectionComponent,
    ResumeFuncSkillComponent,
    ResumeCertifDiplomaComponent,
    ResumeDoneComponent,
  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'fr-CA' }
  ],

})
export class ResumeManagementModule { }
