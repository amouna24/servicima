import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollbarComponent } from '@shared/scrollbar/scrollbar.component';
import { DraggableDirective } from '@shared/scrollbar/draggable.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ScrollbarComponent, DraggableDirective],
  exports: [ScrollbarComponent]
})
export class ScrollbarModule { }
