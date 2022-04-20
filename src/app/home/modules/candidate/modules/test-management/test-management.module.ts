import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { TestQcmComponent } from './test-qcm/test-qcm.component';
import { WelcomeToTestComponent } from './welcome-to-test/welcome-to-test.component';
import { GenerateReportPipePipe } from './generate-report/generate-report-pipe.pipe';

@NgModule({
  declarations: [ TestQcmComponent, WelcomeToTestComponent, GenerateReportPipePipe ],
    imports: [
        CommonModule,
        TestManagementRoutingModule,

        SharedModule,
        MonacoEditorModule.forRoot()
    ]
})
export class TestManagementModule { }
