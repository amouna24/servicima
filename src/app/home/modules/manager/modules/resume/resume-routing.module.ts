import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { ResumeGeneralInformationComponent } from '@shared/modules/resume-management/modules/resume-general-informations/resume-general-information.component';
import { ResumeLanguageComponent } from '@shared/modules/resume-management/modules/resume-languages/resume-language.component';
import { ResumeInterventionComponent } from '@shared/modules/resume-management/modules/resume-interventions/resume-intervention.component';
import { ResumeTechSkillComponent } from '@shared/modules/resume-management/modules/resume-technical-skills/resume-tech-skill.component';
import { ResumeDynamicSectionComponent } from '@shared/modules/resume-management/modules/resume-dynamic-section/resume-dynamic-section.component';
import { ResumeFuncSkillComponent } from '@shared/modules/resume-management/modules/resume-functional-skills/resume-func-skill.component';
import { ResumeCertifDiplomaComponent } from '@shared/modules/resume-management/modules/resume-certification-diploma/resume-certif-diploma.component';
import { ResumeDoneComponent } from '@shared/modules/resume-management/modules/resume-done/resume-done.component';
import { ResumeCertificationsComponent } from '@shared/modules/resume-management/modules/resume-certifications/resume-certifications.component';
// tslint:disable-next-line:max-line-length
import { ProExpComponent } from '@shared/modules/resume-management/modules/resume-professional-experiences/modules/professional-experiences/pro-exp.component';
// tslint:disable-next-line:max-line-length
import { ProExpProjectsComponent } from '@shared/modules/resume-management/modules/resume-professional-experiences/modules/professional-experiences-projects/pro-exp-projects.component';

import { ResumeComponent } from './resume.component';

const routes: Routes = [
  {
    path: '',
    component: ResumeComponent
  },
  {
    path: 'generalInformation',
    component: ResumeGeneralInformationComponent
  },
  {
    path: 'certifications',
    component: ResumeCertificationsComponent
  },
  {
    path: 'diploma',
    component: ResumeCertifDiplomaComponent
  },
  {
    path: 'technicalSkills',
    component: ResumeTechSkillComponent
  },
  {
    path: 'functionnalSkills',
    component: ResumeFuncSkillComponent
  },
  {
    path: 'intervention',
    component: ResumeInterventionComponent
  },
  {
    path: 'professionalExperience',
    component: ProExpComponent
  },
  {
    path: 'dynamicSection',
    component: ResumeDynamicSectionComponent
  },
  {
    path: 'language',
    component: ResumeLanguageComponent
  },
  {
    path: 'projects',
    component: ProExpProjectsComponent
  },
  {
    path: 'done',
    component: ResumeDoneComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeRoutingModule { }
