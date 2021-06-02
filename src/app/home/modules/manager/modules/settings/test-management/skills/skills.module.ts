import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsListComponent } from './skills-list/skills-list.component';
import { AddSkillsComponent } from './add-skills/add-skills.component';
import {SharedModule} from "@shared/shared.module";
import {DynamicDataTableModule} from "@shared/modules/dynamic-data-table/dynamic-data-table.module";
import { EditSkillComponent } from './edit-skill/edit-skill.component';

@NgModule({
  declarations: [SkillsListComponent, AddSkillsComponent, EditSkillComponent],
    imports: [
        CommonModule,
        SkillsRoutingModule,
        SharedModule,
        DynamicDataTableModule
    ]
})
export class SkillsModule { }
