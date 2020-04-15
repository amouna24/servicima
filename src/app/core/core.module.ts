import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
  ]
})
export class CoreModule {
  // CoreModule must be imported only by one NgModule the AppModule
  constructor(
    @Optional() @SkipSelf() core: CoreModule
  ) {
    if (core) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
