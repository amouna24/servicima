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
import { ResumeGuard } from '@core/guard/resume.guard';
import { ResumeCertficationsComponent } from '@shared/modules/resume-management/modules/resume-certfications/resume-certfications.component';

const routes: Routes = [
  { path: '', component: ResumeGeneralInformationComponent},
  { path: '', canActivate: [ResumeGuard],
    loadChildren: () => import('../resume-management/modules/resume-professional-experiences/resume-pro-exp.module')
      .then(m => m.ResumeProExpModule),
  },
  { path: 'language', canActivate: [ResumeGuard],  component: ResumeLanguageComponent},
  { path: 'intervention', canActivate: [ResumeGuard], component: ResumeInterventionComponent},
  { path: 'technicalSkills', canActivate: [ResumeGuard], component: ResumeTechSkillComponent},
  { path: 'dynamicSection', canActivate: [ResumeGuard], component: ResumeDynamicSectionComponent},
  { path: 'functionalSkills', canActivate: [ResumeGuard], component: ResumeFuncSkillComponent},
  { path: 'certifDiploma', canActivate: [ResumeGuard], component: ResumeCertifDiplomaComponent},
  { path: 'done', canActivate: [ResumeGuard], component: ResumeDoneComponent},
  { path: 'certifications', canActivate: [ResumeGuard], component: ResumeCertficationsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeManagementRoutingModule { }
