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

const routes: Routes = [
  { path: '', component: ResumeGeneralInformationComponent},
  { path: '', loadChildren: () => import('../resume-management/modules/resume-professional-experiences/resume-pro-exp.module')
      .then(m => m.ResumeProExpModule),
  },
  { path: 'language', component: ResumeLanguageComponent},
  { path: 'intervention', component: ResumeInterventionComponent},
  { path: 'technicalSkills', component: ResumeTechSkillComponent},
  { path: 'dynamicSection', component: ResumeDynamicSectionComponent},
  { path: 'functionalSkills', component: ResumeFuncSkillComponent},
  { path: 'certifDiploma', component: ResumeCertifDiplomaComponent},
  { path: 'done', component: ResumeDoneComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeManagementRoutingModule { }
