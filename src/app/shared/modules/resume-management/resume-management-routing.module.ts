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
import { ResumeCertificationsComponent } from '@shared/modules/resume-management/modules/resume-certifications/resume-certifications.component';

const routes: Routes = [
  { path: '', component: ResumeGeneralInformationComponent,
    data: {
      breadcrumb: 'General informations'
    }},
  { path: '', canActivate: [ResumeGuard],
    loadChildren: () => import('../resume-management/modules/resume-professional-experiences/resume-pro-exp.module')
      .then(m => m.ResumeProExpModule),
    data: {
      breadcrumb: 'Professional experience'
    },
  },
  { path: 'language', canActivate: [ResumeGuard],  component: ResumeLanguageComponent,
    data: {
      breadcrumb: 'Language'
    }
    },
  { path: 'intervention', canActivate: [ResumeGuard], component: ResumeInterventionComponent,
    data: {
      breadcrumb: 'Level of intervention'
    }
    },
  { path: 'technicalSkills', canActivate: [ResumeGuard], component: ResumeTechSkillComponent,
    data: {
      breadcrumb: 'Technical skills'
    }
  },
  { path: 'dynamicSection', canActivate: [ResumeGuard], component: ResumeDynamicSectionComponent,
    data: {
      breadcrumb: 'Dynamic section'
    }
  },
  { path: 'functionalSkills', canActivate: [ResumeGuard], component: ResumeFuncSkillComponent,
    data: {
      breadcrumb: 'Functional skills'
    }
  },
  { path: 'certifDiploma', canActivate: [ResumeGuard], component: ResumeCertifDiplomaComponent,
    data: {
      breadcrumb: 'Diploma'
    }
    },
  { path: 'done', canActivate: [ResumeGuard], component: ResumeDoneComponent,
    data: {
      breadcrumb: 'Preview'
    }
    },
  { path: 'certifications', canActivate: [ResumeGuard], component: ResumeCertificationsComponent,
    data: {
      breadcrumb: 'Certfications'
    }
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeManagementRoutingModule { }
