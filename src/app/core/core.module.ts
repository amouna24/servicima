import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterDataPipe } from './services/pipe/filter-data.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        FilterDataPipe
    ],
    declarations: [FilterDataPipe]
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
