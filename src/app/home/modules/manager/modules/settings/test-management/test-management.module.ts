import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { TestManagementRoutingModule } from './test-management-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonacoEditorModule,
    TestManagementRoutingModule
  ]
})
export class TestManagementModule { }
