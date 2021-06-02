import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SkillsListComponent } from './skills-list/skills-list.component';
import { AddSkillsComponent } from './add-skills/add-skills.component';
import { EditSkillComponent } from './edit-skill/edit-skill.component';

const routes: Routes = [
  { path: '', component: SkillsListComponent},
  { path: 'add', component: AddSkillsComponent},
  { path: 'edit', component: EditSkillComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }
